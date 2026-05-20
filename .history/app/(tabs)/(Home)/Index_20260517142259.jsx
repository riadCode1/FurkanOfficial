import { useQuranApi } from "@/services/quranApi";
import { useAuth } from "../../../hooks/useAuth";

export default function HomeScreen() {
  const { session } = useAuth();
  const api = useQuranApi();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.getUserProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <Text>Welcome, {profile?.first_name ?? profile?.username ?? "Reader"}</Text>
  );
}