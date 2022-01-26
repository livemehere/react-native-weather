import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  ViewPagerAndroidBase,
} from "react-native";
import * as Location from "expo-location";
import { useState, useEffect } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function App() {
  const [location, setLocation] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [daily, setDaily] = useState([]);

  useEffect(() => {
    getCityName();
  }, []);

  const getCityName = async () => {
    let permission = await Location.requestForegroundPermissionsAsync();

    if (permission.status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync();

    const location = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    setLocation(location[0]);
    setLat(latitude);
    setLon(longitude);
    getWeather();
  };

  const getWeather = async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=kr&units=metric&exclude=alerts&appid=${API_KEY}`
    );
    const json = await response.json();
    setDaily(json.daily);
  };

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>
          {location ? location.district : "Loading..."}
        </Text>
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.weather}
        pagingEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {daily ? (
          daily.map((day) => (
            <View style={styles.day} key={day.dt}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Text style={styles.description}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.day}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 48,
    fontWeight: "600",
    color: "white",
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 158,
    color: "white",
  },
  description: {
    fontSize: 40,
    color: "white",
    marginTop: -20,
  },
  weather: {
    // flex: 1,
  },
  loading: {
    alignItems: "center",
    justifyContent: "center",
  },
});
