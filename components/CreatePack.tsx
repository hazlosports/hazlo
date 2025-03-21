import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Button } from "@/components/UI/Button";
import { useAuth } from "@/context/AuthContext";
import { createPack } from "@/services/packService";
import { Pack } from "@/services/packService";
import { create } from "react-test-renderer";

export default function CreatePack() {
  const { user } = useAuth();
  const [packData, setPackData] = useState<Pack>({
    coach_id: user?.id || "",
    name: "",
    tier: 1,
    price: 0,
    benefits: [],
  });
  const [loading, setLoading] = useState(false);
  const [newBenefit, setNewBenefit] = useState("");
  const [showBenefitInput, setShowBenefitInput] = useState(false); // New state for toggling input field

  const handleSavePack = async () => {
    if (!packData.name || !packData.price || !packData.tier) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    setLoading(true);

    const { success, data, msg } = await createPack(packData);
    setLoading(false);

    if (success) {
      Alert.alert("Success", "Pack created successfully.");
      setPackData({
        coach_id: user?.id || "",
        name: "",
        tier: 1,
        price: 0,
        benefits: [],
      });
    } else {
      Alert.alert("Error", msg || "Failed to create the pack.");
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setPackData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit(""); // Clear input after adding
      setShowBenefitInput(false); // Hide input after adding the benefit
    }
  };

  const handleRemoveBenefit = (benefit: string) => {
    setPackData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((b) => b !== benefit),
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Pack</Text>

      {/* Pack Name */}
      <Text style={styles.subTitle}>Pack Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Pack Name"
        placeholderTextColor="#a0a0a0"
        value={packData.name}
        onChangeText={(text) => setPackData({ ...packData, name: text })}
      />

      {/* Price */}
      <Text style={styles.subTitle}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        placeholderTextColor="#a0a0a0"
        value={String(packData.price)}
        onChangeText={(text) => setPackData({ ...packData, price: parseFloat(text) })}
      />

      {/* Tier */}
      <Text style={styles.subTitle}>Tier</Text>
      <TextInput
        style={styles.input}
        placeholder="Tier"
        keyboardType="numeric"
        placeholderTextColor="#a0a0a0"
        value={String(packData.tier)}
        onChangeText={(text) => setPackData({ ...packData, tier: parseInt(text) })}
      />

      {/* Add Benefit Section */}
      <View>
        {/* List of Benefits */}
        <View style={styles.benefitContainer}>

        <FlatList
          data={packData.benefits}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.benefitItem}>
              <Text style={styles.benefitText}>{item}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveBenefit(item)}
              >
                <Text style={styles.removeButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        </View>

        {/* Plus Sign to Add Benefit */}
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setShowBenefitInput(!showBenefitInput)}
        >
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>

        {/* Conditional Input for New Benefit */}
        {showBenefitInput && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="New Benefit"
              placeholderTextColor="#a0a0a0"
              value={newBenefit}
              onChangeText={setNewBenefit}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddBenefit}>
              <Text style={styles.addButtonText}>Add Benefit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <Button title="Create Pack" onPress={handleSavePack} loading={loading} size= {"large"} variant={"coach"} />  
      )}
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#0e0e0e", // Dark background color
    },
    header: {
      fontSize: 24,
      fontWeight: "600",
      marginBottom: 20,
      color: "#fff",
    },
    subTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: "#b0b0b0",
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: "#444",
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
      fontSize: 16,
      color: "#fff",
    },
    benefitContainer: {
        borderWidth : 1,
        borderColor : "#444",
        borderRadius: 5,
        flexDirection: "column",
        justifyContent: "flex-start",
        padding: "5%"  
    },
    plusButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#4CAF50", // Green border for a minimalistic feel
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 6, // Slightly sharper edges
      alignSelf: "flex-start",
      marginBottom: 10,
    },
    plusButtonText: {
      color: "#4CAF50", // Green color for minimalism
      fontWeight: "600",
      fontSize: 22, // Slightly smaller text
    },
    addButton: {
        alignSelf : "flex-end",
      borderWidth :1,
      borderColor : "white", // Keep the green for add button
      padding: "2%",
      borderRadius: 5,
      marginTop: 10,
    },
    addButtonText: {
      color: "#fff",
      fontWeight: "600",
    },
    benefitItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    benefitText: {
      fontSize: 16,
      color: "#fff",
    },
    removeButton: {
      backgroundColor: "transparent", // Transparent for a minimal design
      borderColor: "red", // Red border for the remove button
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: "100%",
    },
    removeButtonText: {
      color: "#FF6347", // Red text for the remove button
      fontWeight: "600",
      fontSize: 18, // Smaller text for a more minimalistic effect
    },
  }); 