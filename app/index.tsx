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
import Checkbox from "expo-checkbox";
import { fetchCharacters } from "../api/characters";
import { useCharacterStore } from "../store/characterStore";

export default function Page() {
  const {
    tags,
    inputValue,
    results,
    addTag,
    removeTag,
    setInputValue,
    setResults,
  } = useCharacterStore();

  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (inputValue.trim().length > 0) {
        const characters = await fetchCharacters(inputValue);
        setResults(characters);
      } else {
        setResults([]);
      }
    };

    fetchData();
  }, [inputValue]);

  const toggleCharacterSelection = (characterName: string) => {
    if (selectedCharacters.includes(characterName)) {
      setSelectedCharacters((prev) =>
        prev.filter((name) => name !== characterName)
      );
      removeTag(tags.indexOf(characterName));
    } else {
      setSelectedCharacters((prev) => [...prev, characterName]);
      addTag(characterName);
    }
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
            <TouchableOpacity onPress={() => removeTag(index)}>
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
            onPress={() => toggleCharacterSelection(item.name)}
          >
            <Checkbox
              value={selectedCharacters.includes(item.name)}
              onValueChange={() => toggleCharacterSelection(item.name)}
              color={
                selectedCharacters.includes(item.name) ? "#0175FF" : undefined
              }
              style={styles.checkbox}
            />
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
    margin: 10,
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
    gap: 7,
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
  checkbox: {
    borderRadius: 7,
  },
});
