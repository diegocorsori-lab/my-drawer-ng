import 'zone.js';
import 'zone.js/testing';
import { runTestApp } from '@nativescript/unit-test-runner';

declare const require: any;

runTestApp({
    runTests: () => {
        const tests = require.context('./app', true, /\.spec\.ts$/);
        tests.keys().forEach(tests);
    }
});