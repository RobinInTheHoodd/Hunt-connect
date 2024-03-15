import { PoolClient } from "pg";
import app from "../../server";
import request from "supertest";
import pool from "../../db/pgPool";
import { connectStorageEmulator } from "firebase/storage";
let state: string;
let server: any;

let error: any = {
  name: "FirebaseError",
  message: "Une erreur de firebase s'est produite",
  errorType: "firebase",
  code: "",
  detail: "",
};
function formatDate(date: any, dayPlus: any) {
  date.setDate(date.getDate() + dayPlus);
  const year = date.getFullYear();
  // Ajoutez 1 car les mois sont indexés à partir de 0
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Assurez-vous que le mois a toujours 2 chiffres
  const day = ("0" + date.getDate()).slice(-2); // Assurez-vous que le jour a toujours 2 chiffres

  return `${year}-${month}-${day}`;
}
const data: undefined | any = {
  id: 11,
  hutID: 1,
  creatorID: "OJhmyz9l8ZcI2GLEPtdsWkmazvV2",
  fromDate: formatDate(new Date(), 0),
  toDate: formatDate(new Date(), 1),
  weather: {
    id: 6,
    huntingId: 11,
    name: "name",
    tempC: 4,
    conditionText: "Nuageux",
    windKph: 3,
    windDir: "Nord",
    humidity: 4,
  },
  participants: [
    {
      displayName: "Robin",
      role: "Participant",
      userID: "OJhmyz9l8ZcI2GLEPtdsWkmazvV2",
    },
    {
      displayName: "Pierre",
      role: "Invité",
      userID: null,
    },
  ],
  duckTeams: [
    {
      id: 3,
      huntingID: 11,
      latitude: 50.69746873384558,
      longitude: -59.872381612658494,
      specimen: "Canard",
      sex: "Mâle",
      type: "Vivant",
    },
    {
      id: 4,
      huntingID: 11,
      latitude: 50.69664961966099,
      longitude: -59.87467791885138,
      specimen: "Canard",
      sex: "Femelle",
      type: "Forme",
    },
  ],
};

describe("huntSessionController", () => {
  let dataTest = data;
  let spy: any;

  beforeAll((done) => {
    //spy = jest.spyOn(AuthController, "registerController");
    server = app.listen(0, done);
  });
  afterAll((done) => {
    server.close(() => {
      console.log("Server down");
      done();
    });
  });

  beforeEach(() => {
    dataTest = {
      ...data,
    };
  });

  describe("Test fromDate validation", () => {
    it("should fail with an invalid date", async () => {
      dataTest.fromDate = "invalide-date";
      const response = await request(app)
        .post("/hunt/session/add")
        .send(dataTest);
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: "La date de commencement fournie est invalide.",
        field: "fromDate",
      });
    });

    it("should fail with a past date", async () => {
      dataTest.fromDate = "2000-01-01";

      const response = await request(app)
        .post("/hunt/session/add")
        .send(dataTest);
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        message: "La date de commencement doit être dans le futur.",
        field: "fromDate",
      });
    });
  });

  describe("Test toDate validation", () => {
    it("should fail if toDate is invalide", async () => {
      dataTest.toDate = "invalid-date";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La date de fin fournie est invalide.",
        field: "toDate",
      });
    });

    it("should fail is toDate is in the past", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      dataTest.toDate = pastDate.toString();
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La date de fin doit être dans le futur.",
        field: "toDate",
      });
    });
  });
  describe("Test creatorID validation", () => {
    it("should fail if creatorID is null", async () => {
      dataTest.creatorID = undefined;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identification est incorrect",
        field: "creatorID",
      });
    });
  });
  describe("Test weather validation", () => {
    beforeEach(() => {
      dataTest.weather = {
        ...data.weather,
      };
    });
    it("should fail if weather id is a string", async () => {
      dataTest.weather.id = "id";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identifiant de la méteo doit être un nombre",
        field: "weather.id",
      });
    });
    it("should fail if weather id is lower than 0", async () => {
      dataTest.weather.id = -20;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identifiant de la météo doit être supérieur de 0",
        field: "weather.id",
      });
    });
    it("should fail if weather huntingId is a string", async () => {
      dataTest.weather.huntingId = "20";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identifiant de la chasse doit être un nombre",
        field: "weather.huntingId",
      });
    });
    it("should fail if weather huntingId is lower than 0 ", async () => {
      dataTest.weather.huntingId = -20;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identifiant de la chasse doit être supérieur de 0",
        field: "weather.huntingId",
      });
    });
    it("should fail if weather name is not string", async () => {
      dataTest.weather.name = -20;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Le nom doit être une chaîne de charactère",
        field: "weather.name",
      });
    });
    it("should fail if weather name lenght is lower than 4", async () => {
      dataTest.weather.name = "to";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Le nom doit être supérieur à 4 charactère",
        field: "weather.name",
      });
    });
    it("should fail if weather name lenght is greater than 20", async () => {
      dataTest.weather.name = "tojdajdadjdkadjsakdjnsakdnsakjndajdsankjd";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Le nom doit être inférieur à 20 charactère",
        field: "weather.name",
      });
    });
    it("should fail if weather tempC is not a number", async () => {
      dataTest.weather.tempC = "temp";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La température doit être un nombre",
        field: "weather.tempC",
      });
    });
    it("should fail if weather tempC is lower than -30", async () => {
      dataTest.weather.tempC = -50;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La température minimum est de -30",
        field: "weather.tempC",
      });
    });
    it("should fail if weather tempC is greater than 50", async () => {
      dataTest.weather.tempC = 60;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La température maximum est de 50",
        field: "weather.tempC",
      });
    });
    it("should fail if weather conditionText is not a string", async () => {
      dataTest.weather.conditionText = -50;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La condition climatique dois être une chaine de charactère",
        field: "weather.conditionText",
      });
    });
    it("should fail if weather conditionText lenght is greater than 100", async () => {
      dataTest.weather.conditionText =
        "dalsdmlkasdmlkamdlkasdlamdsalkmdsaldmlasmdlkasdsadlsamdlsadlsadsalsadadsandsakjdsandksandksandkasndksadjsnakdsjaksandkasnjdaskdnksadskad";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message:
          "La condition climatique dois être inférieur à 100 charactères",
        field: "weather.conditionText",
      });
    });
    it("should fail if weather conditionText lenght is lower than 4", async () => {
      dataTest.weather.conditionText = "ds";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La condition climatique dois être supérieur à 4 charactères",
        field: "weather.conditionText",
      });
    });
    it("should fail if weather windKph not a number", async () => {
      dataTest.weather.windKph = "dffd";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La vitesse du vent doit être un nombre",
        field: "weather.windKph",
      });
    });

    it("should fail if weather windKph is lower than 0 ", async () => {
      dataTest.weather.windKph = -20;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La vitesse du vent doit être positif",
        field: "weather.windKph",
      });
    });
    it("should fail if weather windKph is greater than 30 ", async () => {
      dataTest.weather.windKph = 60;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La vitesse du vent doit être inférieur à 30km/h",
        field: "weather.windKph",
      });
    });

    it("should fail if weather windDir is not a string", async () => {
      dataTest.weather.windDir = -20;
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La direction du vent doit être une chaine de charactère",
        field: "weather.windDir",
      });
    });
    it("should fail if weather windDir lenght is lower than 3 ", async () => {
      dataTest.weather.windDir = "sr";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La directoin du vent doit être supérieur de 2 charactères",
        field: "weather.windDir",
      });
    });
    it("should fail if weather windDir lenght is greater than 30 ", async () => {
      dataTest.weather.windDir =
        "srfdjfsoijfdiosjfosijfosfsdfsdfdsfsfsfdsfdfdsfdsfdsfdsfds";
      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "La directoin du vent doit être inférieur à 30 charactères",
        field: "weather.windDir",
      });
    });
    it("should fail if weather humidity is not a number ", async () => {
      dataTest.weather.humidity = "fd";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'humidité doit ètre un nombre",
        field: "weather.humidity",
      });
    });
    it("should fail if weather humidity is lower than 0", async () => {
      dataTest.weather.humidity = -3;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'humidité doit ètre supérieur à 0%",
        field: "weather.humidity",
      });
    });
    it("should fail if weather humidity is greater than 100", async () => {
      dataTest.weather.humidity = 105;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'humidité doit ètre inférrieur à 100%",
        field: "weather.humidity",
      });
    });
  });

  describe("Test participants validation", () => {
    beforeEach(() => {
      dataTest = JSON.parse(JSON.stringify(data));
    });
    it("should fail if userId is not a string", async () => {
      dataTest.participants[0].userID = 105;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identifiant du participant est une chaine de charactère",
        field: "participants[0].userID",
      });
    });
    it("should fail if userId is blank", async () => {
      dataTest.participants[0].userID = "";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identifiant du participant doit être suppérieur à 0",
        field: "participants[0].userID",
      });
    });
    it("should fail if displayName is not a string", async () => {
      dataTest.participants[0].displayName = 50;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Le nom du participant est une chaine de charactère",
        field: "participants[0].displayName",
      });
    });
    it("should fail if displayName is lower than 3", async () => {
      dataTest.participants[0].displayName = "re";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Le nom du participant doit être supérieur à 3 charactères",
        field: "participants[0].displayName",
      });
    });
    it("should fail if displayName is greater thab 50", async () => {
      dataTest.participants[0].displayName =
        "refdjksfjdsfkjsbdfkjbdsfkjdsbfkjdsbfkdsbfkjdsbjfkdsbfjkdsbfdsbfdksbfkfsdfds";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Le nom du participant doit être inférieure à 50 charactères",
        field: "participants[0].displayName",
      });
    });
    it("should fail if role is not a string", async () => {
      dataTest.participants[0].role = 20;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Le role du participant est une chaine de charactère",
        field: "participants[0].role",
      });
    });
    it("should fail if role is different than Invité or Participant", async () => {
      dataTest.participants[0].role = "chasseur";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "Le role du participant doit être Invitié ou Participant",
        field: "participants[0].role",
      });
    });
  });

  describe("Test DuckTeams validation", () => {
    beforeEach(() => {
      dataTest = JSON.parse(JSON.stringify(data));
    });

    it("should fail if huntingID is not a number", async () => {
      dataTest.duckTeams[0].huntingID = "chasseur";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identifiant de la chasse doit être un chiffre",
        field: "duckTeams[0].huntingID",
      });
    });
    it("should fail if huntingID is lower than 0 ", async () => {
      dataTest.duckTeams[0].huntingID = -20;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "L'identifiant de la chasse doit être suppérieur de 0",
        field: "duckTeams[0].huntingID",
      });
    });
    it("should fail if latitude is not a number ", async () => {
      dataTest.duckTeams[0].latitude = "latitude";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "la latitude doit être un chiffre",
        field: "duckTeams[0].latitude",
      });
    });
    it("should fail if longitude is not a number ", async () => {
      dataTest.duckTeams[0].longitude = "longitude";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "la longiture doit être un chiffre",
        field: "duckTeams[0].longitude",
      });
    });
    it("should fail if specimen is not a string ", async () => {
      dataTest.duckTeams[0].specimen = 50;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "le spéciment doit être une chaine de charactères",
        field: "duckTeams[0].specimen",
      });
    });
    it("should fail if sex is not a string ", async () => {
      dataTest.duckTeams[0].sex = 50;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "le sexe doit être une chaine de charactères",
        field: "duckTeams[0].sex",
      });
    });
    it("should fail if sex is differe than Mâles or Femelle", async () => {
      dataTest.duckTeams[0].sex = "string";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "le sexe doit être Mâles ou Femelle",
        field: "duckTeams[0].sex",
      });
    });
    it("should fail if type is not a string", async () => {
      dataTest.duckTeams[0].type = 50;

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "le sexe doit être une chaine de charactères",
        field: "duckTeams[0].type",
      });
    });
    it("should fail if type is differe than Forme or Vivant", async () => {
      dataTest.duckTeams[0].type = "invalid";

      const res = await request(app).post("/hunt/session/add").send(dataTest);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: "le sexe doit être Vivant ou Forme",
        field: "duckTeams[0].type",
      });
    });
  });
});
