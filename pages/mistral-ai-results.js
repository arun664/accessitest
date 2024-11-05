import { useState, useEffect } from "react";
import MistralAISuggestions from "../components/MistralAISuggestions";
import LoadingSpinner from "@/components/LoadingSpinner";

const MistralAIResults = () => {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const storedResults = localStorage.getItem("accessibilityResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  if (!results) {
    <LoadingSpinner />
  }
  else {
    return <MistralAISuggestions results={results || []} />;
  }
};

export default MistralAIResults;
