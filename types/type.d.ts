declare interface ButtonProps {
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  variant?: "blue" | "orange" | "outline" | "destructive";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  onPress?: () => void;
  loading?: boolean;
}
