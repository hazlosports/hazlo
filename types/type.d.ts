declare interface ButtonProps {
  textStyle?: StyleProp<TextStyle>;
  title?: string;
  variant?: "hazlo" | "user" | "coach" | "club"  | "service" |  "outline" | "destructive";
  IconLeft?: React.ComponentType<any>;
  IconRight?: React.ComponentType<any>;
  onPress?: () => void;
  loading?: boolean;
}
