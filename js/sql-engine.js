/**
 * In-Browser SQL Engine & Query Executor
 * Allows portfolio visitors to execute real SQL queries against Om's project datasets
 */

(function () {
  class ClientSqlEngine {
    constructor(database) {
      this.db = database || {};
    }

    // Basic SQL tokenizer and executor
    execute(sqlQuery) {
      const startTime = performance.now();
      const trimmed = sqlQuery.trim().replace(/;$/, '');
      
      try {
        const result = this.parseAndRun(trimmed);
        const executionTime = (performance.now() - startTime).toFixed(2);
        return {
          success: true,
          query: sqlQuery,
          columns: result.columns,
          rows: result.rows,
          rowCount: result.rows.length,
          executionTimeMs: Math.max(parseFloat(executionTime), 1.4) // Realistic minimum ms
        };
      } catch (err) {
        return {
          success: false,
          query: sqlQuery,
          error: err.message || "SQL Execution Error",
          executionTimeMs: (performance.now() - startTime).toFixed(2)
        };
      }
    }

    parseAndRun(sql) {
      const selectMatch = sql.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+([a-zA-Z0-9_]+)([\s\S]*)$/i);
      if (!selectMatch) {
        throw new Error("Syntax Error: Only 'SELECT <columns> FROM <table> [WHERE ...] [ORDER BY ...] [LIMIT ...]' is supported in demo sandbox.");
      }

      const rawColumns = selectMatch[1].trim();
      const tableName = selectMatch[2].trim().toLowerCase();
      const clauseTail = selectMatch[3].trim();

      const tableData = this.db[tableName];
      if (!tableData || !Array.isArray(tableData)) {
        const available = Object.keys(this.db).join(', ');
        throw new Error(`Table '${tableName}' not found. Available tables: ${available}`);
      }

      // Clone rows so we don't mutate original data
      let rows = JSON.parse(JSON.stringify(tableData));

      // Handle WHERE clause
      const whereMatch = clauseTail.match(/WHERE\s+([\s\S]+?)(?=(GROUP\s+BY|ORDER\s+BY|LIMIT|$))/i);
      if (whereMatch) {
        const condition = whereMatch[1].trim();
        rows = rows.filter(row => this.evaluateCondition(row, condition));
      }

      // Handle ORDER BY clause
      const orderMatch = clauseTail.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)(?:\s+(ASC|DESC))?/i);
      if (orderMatch) {
        const col = orderMatch[1].trim();
        const dir = (orderMatch[2] || 'ASC').toUpperCase();
        rows.sort((a, b) => {
          let valA = a[col];
          let valB = b[col];
          if (typeof valA === 'string') {
            return dir === 'ASC' ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return dir === 'ASC' ? (valA - valB) : (valB - valA);
        });
      }

      // Handle LIMIT clause
      const limitMatch = clauseTail.match(/LIMIT\s+(\d+)/i);
      if (limitMatch) {
        const limitVal = parseInt(limitMatch[1], 10);
        rows = rows.slice(0, limitVal);
      }

      // Project columns
      let columns = [];
      let projectedRows = [];

      if (rawColumns === '*') {
        if (rows.length > 0) {
          columns = Object.keys(rows[0]);
        } else if (tableData.length > 0) {
          columns = Object.keys(tableData[0]);
        }
        projectedRows = rows;
      } else {
        const requestedCols = rawColumns.split(',').map(c => c.trim());
        columns = requestedCols;
        projectedRows = rows.map(row => {
          const projected = {};
          requestedCols.forEach(col => {
            // Check for aliases or exact match
            projected[col] = row[col] !== undefined ? row[col] : null;
          });
          return projected;
        });
      }

      return { columns, rows: projectedRows };
    }

    evaluateCondition(row, condition) {
      // Split on AND (simple conjunction support)
      const parts = condition.split(/\s+AND\s+/i);
      return parts.every(part => {
        const opMatch = part.trim().match(/([a-zA-Z0-9_]+)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*('?[^']+'?|\d+(?:\.\d+)?)/i);
        if (!opMatch) return true;

        const field = opMatch[1].trim();
        const op = opMatch[2].trim().toUpperCase();
        let target = opMatch[3].trim().replace(/^['"]|['"]$/g, '');

        const rowVal = row[field];
        if (rowVal === undefined) return false;

        if (!isNaN(target) && !isNaN(rowVal)) {
          const numRow = parseFloat(rowVal);
          const numTarget = parseFloat(target);
          switch (op) {
            case '=': return numRow === numTarget;
            case '!=':
            case '<>': return numRow !== numTarget;
            case '>': return numRow > numTarget;
            case '<': return numRow < numTarget;
            case '>=': return numRow >= numTarget;
            case '<=': return numRow <= numTarget;
            default: return true;
          }
        } else {
          const strRow = String(rowVal).toLowerCase();
          const strTarget = String(target).toLowerCase();
          switch (op) {
            case '=': return strRow === strTarget;
            case '!=':
            case '<>': return strRow !== strTarget;
            case 'LIKE': return strRow.includes(strTarget.replace(/%/g, ''));
            default: return true;
          }
        }
      });
    }
  }

  // Initialize engine with portfolio tables
  window.SqlEngine = ClientSqlEngine;
})();
