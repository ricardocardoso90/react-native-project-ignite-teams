
import { ButtonIconTypeStyleProps, Container, Icon } from './styles';
import { TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = TouchableOpacityProps & {
  icon: keyof typeof MaterialIcons.glyphMap;
  type?: ButtonIconTypeStyleProps;
  onAddUser?: () => void;
}

export function ButtonIcon({ icon, type = 'PRIMARY', onAddUser, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Icon
        name={icon}
        type={type}
        onPress={onAddUser}
      />
    </Container>
  )
}