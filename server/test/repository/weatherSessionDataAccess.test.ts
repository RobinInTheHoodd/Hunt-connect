import { PoolClient } from "pg";
import { DatabaseError } from "../../middleware/errorPostgresMiddleware";
import { IWeatherInfoModel } from "../../models/weather/WeatherModel";
import { generateWeatherModelData } from "../../models/weather/WeatherModelTestData";
import app from "../../server";
import pool from "../../db/pgPool";
import weatherDataAccess from "../../repository/weatherSessionDataAccess";

function generateDatabaseError(
  code: string = "",
  detail: string = ""
): DatabaseError {
  return {
    name: "DatabaseError",
    message: "Une erreur de base de données s'est produite",
    errorType: "postgres",
    code,
    detail,
  };
}

jest.mock("pg", () => {
  const mPoolClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  const mPool = {
    connect: jest.fn().mockResolvedValue(mPoolClient),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe("Weather DataAccess", () => {
  let server: any;
  let fakeWeather: IWeatherInfoModel;
  let poolClient: PoolClient;

  beforeAll((done) => {
    server = app.listen(0, done);
  });
  afterAll((done) => {
    server.close(() => {
      console.log("Server down");
      done();
    });
  });

  beforeEach(async () => {
    fakeWeather = generateWeatherModelData();
    poolClient = await pool.connect();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeEach(() => {
      sqlValues = [
        fakeWeather.huntingId,
        fakeWeather.tempC,
        fakeWeather.conditionText,
        fakeWeather.windDir,
        fakeWeather.windKph,
        fakeWeather.humidity,
      ];

      sqlStatement =
        "INSERT INTO udb.Hunting_Session_Weather " +
        "(" +
        "hunting_session_id,  temp_c,   condition_text," +
        "wind_dir,            wind_kph, humidity" +
        ") " +
        "VALUES" +
        "(" +
        "$1, $2, $3, $4, $5, $6" +
        ") RETURNING id;";
    });

    it("should throw error if null input", async () => {
      const typeConstraintError = generateDatabaseError(
        "23502",
        "Attempted to insert NULL into a column that cannot be null"
      );

      (poolClient.query as jest.Mock).mockRejectedValue(typeConstraintError);

      await expect(
        weatherDataAccess.create(
          fakeWeather.huntingId!,
          fakeWeather,
          poolClient
        )
      ).rejects.toEqual(typeConstraintError);

      expect(poolClient.query).toHaveBeenCalled();
      expect(poolClient.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });

  describe("getByHuntinSessionsID", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeEach(() => {
      sqlValues = [fakeWeather.huntingId];
      sqlStatement =
        "SELECT * FROM udb.hunting_session_weather WHERE hunting_session_id = $1 ";
    });

    it("should return weather", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [
          {
            id: fakeWeather.id,
            hunting_session_id: fakeWeather.huntingId,
            name: fakeWeather.name,
            temp_c: fakeWeather.tempC,
            condition_text: fakeWeather.conditionText,
            wind_kph: fakeWeather.windKph,
            wind_dir: fakeWeather.windDir,
            humidity: fakeWeather.humidity,
          },
        ],
      });

      await expect(
        weatherDataAccess.getByHuntinSessionsID(fakeWeather.huntingId!)
      ).resolves.toEqual(fakeWeather);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });
});
