import AsyncStorage from "@react-native-async-storage/async-storage";

import { AppError } from "@utils/AppError";
import { PlayerStorageDTO } from "./PlayerStorageDTO";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playersGetByGroup } from "./playersGetByGroup";

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storedPlayer = await playersGetByGroup(group);
    const playerAlreadExists = storedPlayer.filter(player => player.name === newPlayer.name);

    if (playerAlreadExists.length > 0) {
      throw new AppError('Essa pessoa já está adicionada em um time aqui.');
    }

    const storage = JSON.stringify([...storedPlayer, newPlayer]);
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage);

  } catch (error) {
    throw (error);
  }
}