import React, { useState } from "react";
import { View, Text, Button, TextInput, FlatList } from "react-native";
import CarRepository, { Car } from "../src/database/CarRepository";

const repository = new CarRepository();

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [term, setTerm] = useState("");
  const [minHp, setMinHp] = useState("");
  const [maxHp, setMaxHp] = useState("");

  const createCar = async () => {
    const id = await repository.create({
      brand: "VW",
      model: "Fusca",
      hp: Math.floor(Math.random() * 100),
    });
    console.log("Created car with ID:", id);
    fetchAllCars();
  };

  const fetchAllCars = async () => {
    const allCars = await repository.all();
    setCars(allCars);
  };

  const deleteCar = async (id: number) => {
    await repository.delete(id);
    console.log(`Car with ID ${id} deleted.`);
    fetchAllCars();
  };

  const searchByModel = async () => {
    const result = await repository.searchByModel(term);
    setCars(result);
  };

  const updateCar = async (car: Car) => {
    const updatedCar: Car = { ...car, model: "Updated Model" };
    await repository.update(updatedCar);
    console.log("Car updated:", updatedCar);
    fetchAllCars();
  };

  const searchByHpRange = async () => {
    const result = await repository.searchByHpRange(
      parseInt(minHp),
      parseInt(maxHp)
    );
    setCars(result);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Create Car" onPress={createCar} />
      <Button title="Fetch All Cars" onPress={fetchAllCars} />

      <TextInput
        placeholder="Search by model"
        value={term}
        onChangeText={setTerm}
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
      />
      <Button title="Search by Model" onPress={searchByModel} />

      <TextInput
        placeholder="Min HP"
        value={minHp}
        onChangeText={setMinHp}
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Max HP"
        value={maxHp}
        onChangeText={setMaxHp}
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
        keyboardType="numeric"
      />
      <Button title="Search by HP Range" onPress={searchByHpRange} />

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id?.toString() || ""}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              padding: 10,
              marginVertical: 5,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Text>
              {item.id}: {item.brand} {item.model} ({item.hp} HP)
            </Text>
            <Button title="Delete" onPress={() => deleteCar(item.id!)} />
            <Button title="Update" onPress={() => updateCar(item)} />
          </View>
        )}
      />
    </View>
  );
}
