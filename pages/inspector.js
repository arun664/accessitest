import { useRouter } from 'next/router';
import XpathInspector from '@/components/XpathInspector'; // Adjust the path as necessary

export default function XpathInspectorPage() {
  const router = useRouter();
  const { url } = router.query; // Extract URL from query parameters

  return (
    <div>
      <XpathInspector url={url} />
    </div>
  );
}