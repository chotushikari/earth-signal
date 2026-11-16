import {test,expect} from '@playwright/test';
test('Discover, source navigation, animations and narrow layout',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{level:1})).toContainText('Discover');
 await expect(page.locator('.hero-earth canvas')).toBeVisible();
 await page.getByRole('button',{name:'Pause animations'}).click();await expect(page.getByRole('button',{name:'Resume animations'})).toHaveAttribute('aria-pressed','true');
 await page.screenshot({path:'.impeccable/review/reference-desktop.png',fullPage:true});
 await page.getByRole('link',{name:'Science data & sources'}).click();await expect(page).toHaveURL(/sources/);await expect(page.locator('#isro')).toBeVisible();
 await page.goto('/');await page.setViewportSize({width:390,height:844});await expect(page.getByRole('button',{name:'Pause animations'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:'.impeccable/review/reference-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('link',{name:'My Earth',exact:true}).click();await page.getByText('Account & cloud sync',{exact:true}).click();await expect(page.locator('.cloud-account')).toBeVisible();
});
test('Local saves persist; reports and readiness are honest',async({page})=>{
 await page.goto('/my-earth');await page.getByRole('button',{name:'Save Vembanad–Kol Wetlands',exact:true}).click();await page.reload();await expect(page.getByRole('heading',{name:/Saved Locations/})).toContainText('(1)');
 await page.goto('/reports/demo');await expect(page.locator('.report-document')).toContainText('Demonstration report');await expect(page.getByRole('button',{name:'Print / Save PDF'})).toBeVisible();
 await page.goto('/readiness');await expect(page.getByRole('heading',{name:'Data Readiness',exact:true})).toBeVisible();await expect(page.locator('.readiness-status').first()).toHaveText('Needs location');
 await page.goto('/investigate/demo');await expect(page.locator('.studio-demo').first()).toContainText('demonstration');const slider=page.getByRole('slider',{name:'Before and after comparison position'});await slider.fill('70');await expect(page.locator('.comparison-divider')).toHaveAttribute('style',/70%/);
});
test('Live discovery returns footprints and evidence',async({page})=>{
 await page.goto('/explore');await expect(page.locator('.ex-search-status')).toContainText(/drawable footprints/, {timeout:35000});
 await expect(page.getByLabel('Catalog source')).toHaveValue('live');
 await page.screenshot({path:'.impeccable/review/explore-desktop.png',fullPage:true});
 const response=await page.request.get('/api/asf-search?maxResults=1&processingLevel=GCOV');expect(response.ok()).toBeTruthy();const body=await response.json();expect(body.records.length).toBeGreaterThan(0);
 await page.goto('/observations?granule='+encodeURIComponent(body.records[0].granuleName));await expect(page.getByRole('button',{name:'Export source metadata'})).toBeVisible({timeout:35000});await expect(page.locator('.granule-name')).toContainText(body.records[0].granuleName);
});
