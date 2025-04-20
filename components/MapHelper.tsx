import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  ScrollView as RNScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import EventCard from "@/components/EventCard";
import { GetMapItemsResponse } from "@/services/mapService";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

type MapHelperProps = {
  items: GetMapItemsResponse;
  onExpandChange?: (disabled: boolean) => void;
};

const gradientMap = {
  Events: ["#0EA8F5", "#692EF8"],
  Coaches: ["#FFBD55", "#FF7009"],
  Services: ["#FF72DC", "#9C00D4"],
};

const MapHelper: React.FC<MapHelperProps> = ({ items, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<RNScrollView>(null);

  const eventItems = items.filter((item) => "event" in item.type);

  const toggleHelper = () => {
    setIsExpanded(!isExpanded);
    onExpandChange?.(!isExpanded); // disable map
  };

  const handleTouchOutside = () => {
    if (isExpanded) {
      setIsExpanded(false);
      onExpandChange?.(false); // re-enable map
    }
  };

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
    scrollRef.current?.scrollTo({ x: SCREEN_WIDTH * index, animated: true });
  };

  const tabLabels = ["Events", "Coaches", "Services"];

  return (
    <>
      {isExpanded && (
        <TouchableWithoutFeedback onPress={handleTouchOutside}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <View
        style={[
          styles.container,
          {
            height: isExpanded ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.1,
            backgroundColor: isExpanded ? "rgba(14,14,14,1)" : "rgba(14,14,14,0.8)",
          },
        ]}
      >
        
        <TouchableOpacity onPress={toggleHelper} style={styles.touchable}>
          <View style={styles.openHelperBar}>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabContainer}
          >
            {tabLabels.map((label, index) => (
              <Pressable key={label} onPress={() => handlePageChange(index)} style={styles.pressableWrapper}>
                {currentPage === index ? (
                  <LinearGradient
                    colors={gradientMap[label as keyof typeof gradientMap]}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={styles.mapTypesButtonsGradient}
                  >
                    <Text style={styles.pageTitleActive}>{label}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.mapTypesButtons}>
                    <Text style={styles.pageTitle}>{label}</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </TouchableOpacity>

        <RNScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ width: SCREEN_WIDTH * 4 }}
        >
          {/* Page 0: Events */}
          <View style={[styles.page, { width: SCREEN_WIDTH }]}>
            <FlatList
              data={eventItems}
              keyExtractor={(item) => item.type?.id?.toString() || Math.random().toString()}
              renderItem={({ item }) => <EventCard event={item.type} showBanner = {false}/>}
              contentContainerStyle={styles.listContent}
            />
          </View>

          {/* Pages 1–3 */}
          {[1, 2, 3].map((page) => (
            <View key={page} style={[styles.page, { width: SCREEN_WIDTH }]}>
              <View style={styles.placeholderBox}>
                <Text style={styles.pageTitle}>Page {page}</Text>
              </View>
            </View>
          ))}
        </RNScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "red",
    zIndex: 2,
    padding : 50,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
  },
  touchable: {
    marginBottom : 20
  },
  openHelperBar:
  {
    height : 2,
    backgroundColor :"grey",
    width: 50,
    alignSelf :"center",
    borderRadius : 10,
    marginVertical : 10
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  pressableWrapper: {
    marginHorizontal: 5,
  },
  mapTypesButtons: {
    backgroundColor: "#2e2e2e",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",

  },
  mapTypesButtonsGradient: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",

  },
  page: {
  },
  pageTitle: {
    fontSize: 12,
    fontWeight: "semibold",
    color: "#999",
    alignSelf : "center"
  },
  pageTitleActive: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholderBox: {
    backgroundColor: "#ddd",
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  listContent: {
    paddingBottom: 100,
  },
});

export default MapHelper;
