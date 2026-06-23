import { stringify } from "csv-stringify";

class CsvService {
  async dataToString(data: any[]): Promise<string> {
    return new Promise((resolve, reject) => {
      stringify(data, { header: true }, (err, output) => {
        if (err) reject(err);
        resolve(output);
      });
    });
  }
}

export default new CsvService();
