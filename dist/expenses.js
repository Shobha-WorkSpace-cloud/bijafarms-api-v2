"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeExpenses = void 0;
var express_1 = __importDefault(require("express"));
var supabaseClient_1 = __importDefault(require("./supabaseClient"));
var router = express_1.default.Router();
var writeExpenses = function (expenses) { return __awaiter(void 0, void 0, void 0, function () {
    var expn, _a, data, error, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!expenses || expenses.length === 0) {
                    console.warn("No expenses to write");
                    return [2 /*return*/];
                }
                console.log("Processing expenses for insert:", expenses);
                expn = expenses.map(function (expense) {
                    return {
                        id: expense.id,
                        date: expense.date,
                        type: expense.type,
                        description: expense.description,
                        amount: expense.amount,
                        paidBy: expense.paidBy,
                        category: expense.category, // Use the category name directly for now
                        subCategory: expense.subCategory,
                        source: expense.source,
                        notes: expense.notes,
                    };
                });
                console.log("Prepared expenses for Supabase:", expn);
                return [4 /*yield*/, supabaseClient_1.default
                        .from('expenses')
                        .insert(expn)
                        .select()];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error) {
                    console.error("Supabase insert error:", error);
                    throw error;
                }
                console.log("Expenses written to Supabase:", data);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Error writing expenses:", error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.writeExpenses = writeExpenses;
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, error, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, supabaseClient_1.default
                        .from('expenses')
                        .select('*')];
            case 1:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error) {
                    console.error('Error fetching expenses:', error.message);
                    return [2 /*return*/, res.status(500).json({ error: error.message })];
                }
                res.status(200).json(data);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Unexpected error:', error_2.message);
                res.status(500).json({ error: 'An unexpected error occurred.' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/test-connection', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tables, tablesError, testExpense, _b, insertData, insertError, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, supabaseClient_1.default
                        .from('information_schema.tables')
                        .select('table_name')
                        .eq('table_schema', 'public')];
            case 1:
                _a = _c.sent(), tables = _a.data, tablesError = _a.error;
                console.log('Available tables:', tables);
                console.log('Tables error:', tablesError);
                testExpense = {
                    id: 'test-' + Date.now(),
                    description: 'Test expense',
                    amount: 10.50,
                    category: 'Test',
                    type: 'expense',
                    date: new Date().toISOString().split('T')[0],
                    paidBy: 'Test User',
                    subCategory: 'Test Sub',
                    source: 'Test Source',
                    notes: 'Test notes'
                };
                return [4 /*yield*/, supabaseClient_1.default
                        .from('expenses')
                        .insert([testExpense])
                        .select()];
            case 2:
                _b = _c.sent(), insertData = _b.data, insertError = _b.error;
                console.log('Test insert data:', insertData);
                console.log('Test insert error:', insertError);
                res.json({
                    tables: tables || 'Error getting tables',
                    tablesError: tablesError,
                    insertData: insertData,
                    insertError: insertError,
                    testExpense: testExpense
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _c.sent();
                console.error('Test connection error:', error_3);
                res.status(500).json({ error: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/write', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var expenses, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                expenses = req.body.expenses;
                if (!expenses || !Array.isArray(expenses)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid request: expenses array is required' })];
                }
                return [4 /*yield*/, writeExpenses(expenses)];
            case 1:
                _a.sent();
                res.status(200).json({
                    message: "Successfully wrote ".concat(expenses.length, " expenses to database"),
                    count: expenses.length
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error in POST /expenses/write:', error_4.message);
                res.status(500).json({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Export the router so it can be used in other files
exports.default = router;
//# sourceMappingURL=expenses.js.map