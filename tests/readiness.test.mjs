import assert from 'node:assert/strict';
import {assessReadiness} from '../src/services/discovery/readiness.js';
const records=[{granuleName:'A',processingLevel:'GCOV',startTime:'2026-11-14T01:00:00Z',stringFootprint:'POLYGON EMPTY'},{granuleName:'B',processingLevel:'GCOV',startTime:'2026-11-14T02:00:00Z',stringFootprint:'POLYGON ((0 0,1 0,1 1,0 0))'}];
const result=assessReadiness(records,'GCOV',{location:true});
assert.equal(result.count,2);assert.equal(result.dates.length,1);assert.equal(result.validGeometry,1);assert.equal(result.status,'limited');assert.equal(result.scienceReady,false);
assert.equal(assessReadiness([],'SME2',{location:true}).status,'no_data');
assert.equal(assessReadiness([],'GCOV',{error:'Provider timeout'}).status,'error');
assert.equal(assessReadiness([{granuleName:'C',processingLevel:'GCOV',stringFootprint:'garbage'}],'GCOV').validGeometry,0);
console.log('Readiness truth boundary, source counts and dates passed.');
