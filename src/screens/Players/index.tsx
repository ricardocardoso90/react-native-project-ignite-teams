import { useState, useEffect, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { playersRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { playerGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Loading } from "@components/Loading";
import { ListEmpty } from "@components/ListEmpty";
import { Highlight } from "@components/Hightlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { PlayerCard } from "@components/PlayerCard";

import { AppError } from "@utils/AppError";

interface RouteParams {
  group: string;
};

export function Players() {
  const [team, setTeam] = useState('Time A');
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const route = useRoute();
  const navigation = useNavigation();
  const { group } = route.params as RouteParams;

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert(
        'Nova pessoa',
        'Informe o nome da pessoa para adicionar.'
      );
    };

    const newPlayer = {
      name: newPlayerName, team
    };

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();
      setNewPlayerName('');
      fetchPlayersByTeam();

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa',
          error.message);
      } else {
        console.log(error);
        Alert.alert(
          'Nova pessoa',
          'Não foi possível adicionar.'
        );
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const playersByTeam = await playerGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);

    } catch (error) {
      console.log(error);
      Alert.alert(
        'Pessoas',
        'Não foi possível carregar as pessoas do time selecionado.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playersRemoveByGroup(playerName, group);
      fetchPlayersByTeam();

    } catch (error) {
      console.log(error);
      Alert.alert(
        'Remover pessoa',
        'Não foi possível remover essa pessoa.'
      );
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');

    } catch (error) {
      console.log(error);
      Alert.alert(
        'Remover grupo',
        'Não foi possível remover o grupo.'
      );
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover',
      'Deseja remover a turma?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() }
      ]
    );
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />
      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />
      <Form>
        <Input
          autoCorrect={false}
          value={newPlayerName}
          placeholder="Nome da pessoa"
          onChangeText={setNewPlayerName}
          inputRef={newPlayerNameInputRef}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>
      <HeaderList>

        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            < Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      {isLoading
        ? <Loading />
        : (
          <FlatList
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <PlayerCard
                name={item.name}
                onRemove={() => handlePlayerRemove(item.name)}
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty
                message="Não há pessoas nesse time."
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              { paddingBottom: 100 },
              players.length === 0 && { flex: 1 }
            ]}
          />
        )}
      <Button
        title="Remover turma"
        type="SECUNDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}