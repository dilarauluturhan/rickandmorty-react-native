import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

export default function Page() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const fetchCharacters = async (query: string) => {
    try {
      const response = await fetch(
        `https://rickandmortyapi.com/api/character/?name=${query}`
      );
      const data = await response.json();
      console.log("api success baby:", data);

      if (data.results) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.log("api error:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      fetchCharacters(inputValue);
    } else {
      setResults([]);
    }
  }, [inputValue]);

  const handleAddTag = (name: string) => {
    if (!tags.includes(name)) {
      setTags([...tags, name]);
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const highlightQuery = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} style={styles.highlight}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <TouchableOpacity onPress={() => handleRemoveTag(index)}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Search characters"
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => handleAddTag(item.name)}
          >
            <Image source={{ uri: item.image }} style={styles.characterImage} />
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>
                {highlightQuery(item.name, inputValue)}
              </Text>
              <Text style={styles.episodeCount}>
                {item.episode.length} Episodes
              </Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.resultsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#98A6BB",
    borderRadius: 15,
    padding: 2,
    width: "100%",
    minHeight: 50,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  tagText: {
    fontSize: 14,
    marginRight: 5,
    color: "#344255",
    padding: 2,
  },
  removeText: {
    fontSize: 16,
    color: "#FFF",
    backgroundColor: "#94A3B8",
    borderRadius: 5,
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    margin: 5,
    padding: 0,
  },
  resultsList: {
    marginTop: 10,
    width: "100%",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,

    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
  },
  characterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    fontWeight: "thin",
    color: "#344255",
  },
  episodeCount: {
    fontSize: 14,
    color: "#6B7280",
  },
  highlight: {
    fontWeight: "bold",
    color: "#475569",
  },
});
