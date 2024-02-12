import { readFileSync } from "fs";
import { PARSED_DATA } from "./constants/expectedParsedData";
import { TEST_QUERIES } from "./constants/testQueries";
import { executeWhereCondition } from "./util/executeWhereCondition";
import { getAllRows } from "./util/getAllRows";
import { parseData } from "./util/parseData";
import { parseQuery } from "./util/parseQuery";
import { parseWhereCondition } from "./util/parseWhereCondition";
import { selectColumns, trimColName } from "./util/selectColumns";
import { tokenize } from "./util/tokenize";

describe("main test", () => {
  it(`should parse the data`, () => {
    // Read the data from data.json
    const fileContent = readFileSync("data.json", "utf8");
    if (!fileContent) throw new Error("File content is empty");
    // Parse the data from JSON
    const jsonData = JSON.parse(fileContent);
    /**
     * I forgot to make the json flat.
     * I originally had it supporting multiple tables
     */
    const tables = { user: jsonData };
    const parsedData = parseData(tables);

    expect(parsedData).toEqual(PARSED_DATA);
  });

  for (const q of TEST_QUERIES) {
    const parsedData = PARSED_DATA;
    const tableName = q.expectedQuery.from;

    const allRows = getAllRows({
      parsedData,
      tableName,
    });

    it(`should parse query: ${q.input}`, () => {
      const parsedQuery = parseQuery(q.input);
      expect(parsedQuery).toEqual(q.expectedQuery);
    });

    it("should have the correct number of expected rows", () => {
      const allRowsLength = allRows?.data.length || null;

      expect(allRowsLength).toEqual(q.expectedLengthOfAllRows);
    });

    if (q.expectedWhere) {
      it(`should tokenize whereStr`, () => {
        if (!q.expectedQuery.whereStr) {
          throw new Error("Expected q.expectedQuery.whereStr to be defined");
        }
        const tokens = tokenize(q.expectedQuery.whereStr);

        expect(tokens).toEqual(q.expectedTokens);
      });

      it(`should convert tokens to where condition`, () => {
        if (!q.expectedTokens) {
          throw new Error("Expected q.expectedTokens to be defined");
        }
        const whereCondition = parseWhereCondition(q.expectedTokens);
        expect(whereCondition).toEqual(q.expectedWhere);
      });

      it(`should execute the WhereCondition`, () => {
        if (!q.expectedWhere) {
          throw new Error("THIS SHOULD BE IMPOSSIBLE");
        }
        if (!allRows) {
          throw new Error("Expected allRows to be truthy");
        }

        try {
          const filteredData = executeWhereCondition({
            parsedTable: allRows,
            where: q.expectedWhere,
          });

          if (
            filteredData.data.length !== q.expectedFilteredRows?.data.length
          ) {
            console.error(
              "\n\nFILTERED_DATA:\n",
              JSON.stringify(filteredData, null, 2)
            );
          }

          expect(filteredData).toEqual(q.expectedFilteredRows);
        } catch (e) {
          const error = e as Error;
          expect(error.message).toEqual(q.shouldFailWithError);
        }
      });

      it(`should select the desired columns`, () => {
        if (q.expectedFilteredRows) {
          const { schema } = q.expectedFilteredRows;
          const filteredRows = q.expectedFilteredRows.data;
          const selectedColumns = q.expectedQuery.select;

          const rowDtos = filteredRows.map((row) => {
            const dto = selectColumns({
              selectedColumns,
              schema,
              row,
            });

            return dto;
          });

          if (!selectedColumns.includes("*")) {
            const recieved = selectedColumns.map(trimColName);
            rowDtos.forEach((rowDto) => {
              const keys = Object.keys(rowDto);
              keys.forEach((key) => {
                expect(recieved).toContain(key);
              });
            });
          }
        }
      });
    }
  }
});
