import { executeTransaction } from "./SQLiteDatabase";

export type Car = {
  id?: number;
  brand: string;
  model: string;
  hp: number;
};

export default class CarRepository {
  constructor() {
    this.up();
  }

  public async up() {
    await executeTransaction(
      "CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, hp INT);"
    );
  }

  public async down() {
    await executeTransaction("DROP TABLE cars;");
  }

  public async create(car: Car) {
    const result = await executeTransaction(
      "INSERT INTO cars (brand, model, hp) values (?, ?, ?);",
      [car.brand, car.model, car.hp]
    );
    return result.insertId;
  }

  public async all() {
    const result = await executeTransaction("SELECT * FROM cars");
    return result.rows._array;
  }

  public async delete(id: number) {
    const result = await executeTransaction(
      "delete from cars where id = (?);",
      [id]
    );
    return result.insertId;
  }

  public async searchByModel(term: string) {
    const result = await executeTransaction(
      "select * from cars where model like ?;",
      [`%${term}%`]
    );
    return result.rows._array;
  }

  public async searchByHpRange(minHP: number, maxHP:number) {
    const result = await executeTransaction(
      "select * from cars where hp >= ? and hp <= ?;",
      [minHP, maxHP]
    );
    return result.rows._array;
  }

  public async update(car: Car) {
    const result = await executeTransaction(
      "UPDATE cars SET brand = ?, model = ?, hp = ? WHERE id = ?;",
          [car.brand, car.model, car.hp],
    );
    return result.rows._array;
  }

}
