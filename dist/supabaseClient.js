"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var supabaseUrl = 'https://dbmthxrbrlgkuhiznsul.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRibXRoeHJicmxna3VoaXpuc3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTU0ODEsImV4cCI6MjA3MDEzMTQ4MX0.b6gFaZcT5AdVPomr7U-5Y2S_slIqza_4zeCtkC5s8Kc';
if (!supabaseKey) {
    throw new Error('SUPABASE_KEY is not defined in environment variables');
}
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
exports.default = supabase;
//# sourceMappingURL=supabaseClient.js.map