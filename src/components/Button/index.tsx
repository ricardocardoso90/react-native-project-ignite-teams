import { TouchableOpacityProps } from "react-native";
import { Container, Title, ButtonTypeStyleProps } from "./styles";

type Props = TouchableOpacityProps & {
  title: string;
  type?: ButtonTypeStyleProps;
  handleNewTurma?: () => void;
}

export function Button({ title, type = 'PRIMARY', handleNewTurma, ...rest }: Props) {  
  return (
    <Container
      type={type}
      onPress={handleNewTurma}
      {...rest}
    >
      <Title>
        {title}
      </Title>
    </Container>
  )
}