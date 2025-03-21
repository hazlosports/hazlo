import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Pack, getPacksByCoachId } from '@/services/packService';
import { useRouter } from 'expo-router';
import PackItem from './PackItem';

const Packs = ({ coachId, horizontal = false }: { coachId: string; horizontal?: boolean }) => {
  const { user } = useAuth(); 
  const router = useRouter();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      setLoading(true);
      try {
        const fetchedPacksResponse = await getPacksByCoachId(coachId);
        const fetchedPacks = fetchedPacksResponse.data;

        if (fetchedPacks) {
          const sortedPacks = fetchedPacks.sort((a: Pack, b: Pack) => b.tier - a.tier);
          setPacks(sortedPacks);
        } else {
          setError('No packs found');
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch packs. Please try again later.');
        setPacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, [coachId]);

  const isOwnProfile = user?.id === coachId;

  // Type guard to check if an item is a valid Pack
  const isPack = (item: any): item is Pack => 'id' in item && 'coach_id' in item;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#FF9500" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={isOwnProfile ? [{ id: 'add-pack' }, ...packs] : packs}
          renderItem={({ item }) =>
            isPack(item) ? (
              <PackItem pack={item} horizontal={horizontal} />
            ) : (
              <View  style={styles.addPackButtonContainer}>
              <Pressable style={styles.addPackButton} onPress={() => router.push("/actionScreen?component=createPack")}>
                <Text style={styles.addPackButtonText}>+</Text>
              </Pressable>
              </View>
            )
          }
          keyExtractor={(item) => (isPack(item) ? item.name : 'add-pack')}
          horizontal={horizontal}
          contentContainerStyle={[
            styles.flatListContent,
            horizontal && styles.horizontalListContent,
          ]}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addPackButtonContainer  : {
    alignContent : "center",
    justifyContent : "center",
    alignSelf :"center",
    width  : 50,
    margin  : "5%"   

  },
  addPackButton: {
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    aspectRatio : 1,
    borderRadius : "100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPackButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  horizontalListContent: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default Packs;
