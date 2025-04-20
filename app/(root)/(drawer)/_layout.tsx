// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/CustomDrawer";

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}