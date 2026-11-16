import {test,expect} from '@playwright/test';
const a={granuleName:'NISAR_L2_UR_GCOV_035_113_A_006_4005_DHDH_A_20261113T003207_TEST',startTime:'2026-11-13T00:32:07Z',processingLevel:'GCOV',track:113,frameNumber:6,flightDirection:'ASCENDING',sensor:'L-SAR',polarization:'HH',pgeVersion:'v1',stringFootprint:'POLYGON ((76 9,77 9,77 10,76 9))'};
const b={...a,granuleName:a.granuleName.replace('20261113','20261001'),startTime:'2026-10-01T00:32:07Z'};
test('Exact AOI and dates reach readiness, records, investigation and exported evidence',async({page})=>{
 const requests=[];await page.route('**/api/asf-search?**',route=>{const p=new URL(route.request().url()).searchParams;requests.push(p);return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({source:'ASF test fixture',records:p.get('processingLevel')==='GCOV'?[a,b]:[],query:Object.fromEntries(p),fetchedAt:'2026-11-15T00:00:00Z',limit:80})});});
 await page.goto('/explore?bounds=76,9,76.5,9.5&start=2026-01-01&end=2026-11-14&product=GCOV',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.ex-search-status')).toContainText('2 observations');
 await page.getByRole('button',{name:'Start investigation',exact:true}).click();await expect(page.getByRole('heading',{name:'Data Readiness',exact:true})).toBeVisible();
 await expect(page.locator('.readiness-list details').first()).toContainText('2 observations',{timeout:15000});
 expect(requests.every(p=>p.get('intersectsWith')==='POLYGON((76 9,76.5 9,76.5 9.5,76 9.5,76 9))'&&p.get('start')==='2026-01-01'&&p.get('end')==='2026-11-14')).toBeTruthy();
 await page.locator('.readiness-list details').first().locator('summary').click();await page.getByRole('button',{name:'Inspect GCOV records'}).first().click();
 await expect(page.getByRole('heading',{name:'Observation records'})).toBeVisible();await page.getByRole('checkbox',{name:`Select ${a.granuleName}`,exact:true}).check();await page.getByRole('checkbox',{name:`Select ${b.granuleName}`,exact:true}).check();await expect(page.locator('.pair-status')).toContainText('Metadata candidate');
 await page.getByRole('button',{name:'Open investigation',exact:true}).click();await expect(page.getByRole('heading',{name:'GCOV observation comparison'})).toBeVisible();await expect(page.locator('.investigation-summary')).toContainText('Not run');await expect(page.locator('.browse-empty')).toHaveCount(2);
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export manifest',exact:true}).click();const file=await download;const stream=await file.createReadStream();const chunks=[];for await(const chunk of stream)chunks.push(chunk);const manifest=JSON.parse(Buffer.concat(chunks).toString());expect(manifest.context.area.wkt).toBe('POLYGON((76 9,76.5 9,76.5 9.5,76 9.5,76 9))');expect(manifest.records).toHaveLength(2);expect(manifest.science.measurements).toBeNull();
 await page.getByRole('button',{name:'Save evidence',exact:true}).click();await expect(page.getByRole('status')).toContainText('Evidence saved');await page.goto('/reports');await page.locator('.evidence-library-row').click();await expect(page.locator('.evidence-report')).toContainText(a.granuleName);await expect(page.locator('.evidence-report')).toContainText('No calibrated processing has run');
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('Direct records link reconstructs the same query; incomplete pairs remain limited',async({page})=>{
 await page.route('**/api/asf-search?**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({records:[a,{...b,track:null}],fetchedAt:'2026-11-15T00:00:00Z',query:{},limit:80})}));
 await page.goto('/records?lat=9.62&lon=76.34&product=GCOV',{waitUntil:'domcontentloaded'});await expect(page.locator('.record-table-panel tbody tr')).toHaveCount(2);for(const checkbox of await page.getByRole('checkbox').all())await checkbox.check();await expect(page.locator('.pair-status')).toContainText('incomplete');
 await page.getByRole('button',{name:'Open investigation',exact:true}).click();await page.getByRole('button',{name:'Metadata screening',exact:true}).click();await expect(page.locator('.evidence-detail')).toContainText('track: source metadata is incomplete.');await expect(page.locator('.investigation-summary')).toContainText('Limited');
});

test('A processed AOI creates a report with its applied query and quality evidence',async({page})=>{
 const response={records:[a,b],source:'ASF Search',fetchedAt:'2026-11-15T00:00:00Z',query:{flightDirection:'ASCENDING',relativeOrbit:'113'},limit:40};
 await page.route('**/api/asf-search?**',route=>route.fulfill({json:response}));
 await page.route('**/api/gcov',async route=>{
  expect(route.request().postDataJSON()).toMatchObject({
   granules:[a.granuleName,b.granuleName],bounds:[76,9,76.5,9.5],lat:9.25,lon:76.25,channel:'VVVV',
  });
  await route.fulfill({json:{
   product:'GCOV',latitude:9.25,longitude:76.25,windowPixels:128,validPixels:64,totalPixels:100,
   medianChangeDb:-1.2,medianBackscatterDb:[-9,-10.2],backscatterDisplayDb:[-30,5],
   sources:[a,b].map(record=>({granule:record.granuleName,spacing:[10,-10],dataset:'/GCOV/VVVV'})),
   qualityRule:'Positive power and source mask',previews:[],
  }});
 });
 const params=new URLSearchParams({bounds:'76,9,76.5,9.5',product:'GCOV',orbit:'ASCENDING',track:'113',limit:'40',a:a.granuleName,b:b.granuleName});
 await page.goto(`/investigate/selected?${params}`,{waitUntil:'domcontentloaded'});
 await page.getByLabel('Covariance channel').selectOption('VVVV');
 await page.getByRole('button',{name:'Process comparison'}).click();
 await expect(page.getByText('Processed report saved in this browser.')).toBeVisible();
 await page.goto('/reports',{waitUntil:'domcontentloaded'});
 await page.locator('.evidence-library-row').click();
 const report=page.locator('.evidence-report');
 await expect(report).toContainText('64 valid paired pixels');
 await expect(report).toContainText('ASCENDING');
 await expect(report).toContainText('/GCOV/VVVV');
});
