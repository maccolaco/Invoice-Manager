import { ThemeProvider } from "../theme-provider";
import Login from "@/pages/login";

export default function LoginExample() {
  return (
    <ThemeProvider>
      <Login />
    </ThemeProvider>
  );
}
