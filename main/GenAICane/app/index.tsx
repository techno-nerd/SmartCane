import CameraInput from "@/components/CameraInput";
import { initializeStorage } from "@/components/Storage";

export default function Index() {
  initializeStorage();
  return (
      <CameraInput />
  );
}
