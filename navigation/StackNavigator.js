import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ArticleDetailScreen from "../screens/ArticleDetailScreen";
import NewArticleScreen from "../screens/NewArticleScreen";
import AdminScreen from "../screens/AdminScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Accueil" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Accueil" component={HomeScreen} />
      <Stack.Screen name="Connexion" component={LoginScreen} />
      <Stack.Screen name="Inscription" component={RegisterScreen} />
      <Stack.Screen name="Article" component={ArticleDetailScreen} />
      <Stack.Screen name="Nouvel Article" component={NewArticleScreen} />
      <Stack.Screen name="Administration" component={AdminScreen} />
    </Stack.Navigator>
  );
}
