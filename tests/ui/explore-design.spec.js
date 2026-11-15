import {test,expect} from '@playwright/test';
test('Explore reference layout, live search, map controls and timeline',async({page})=>{
 await page.setViewportSize({width:1214,height:667});await page.goto('/explore');
 await expect(page.locator('.ex-search-status')).toContainText('drawable footprints',{timeout:35000});
 await expect(page.locator('.explore-inspector h2')).toHaveText('Vembanad Lake, Kerala');
 await expect(page.getByRole('button',{name:'Zoom in',exact:true})).toBeEnabled();
 const columns=await page.evaluate(()=>{const left=document.querySelector('.explore-search').getBoundingClientRect(),map=document.querySelector('.explore-canvas').getBoundingClientRect(),right=document.querySelector('.explore-inspector').getBoundingClientRect();return {ordered:left.right<map.left&&map.right<right.left,mapDominates:map.width>left.width&&map.width>right.width,overflow:document.documentElement.scrollWidth>innerWidth};});expect(columns).toEqual({ordered:true,mapDominates:true,overflow:false});
 await page.getByRole('button',{name:'Zoom in',exact:true}).click();await page.getByRole('button',{name:'Zoom out',exact:true}).click();await page.getByRole('button',{name:'Recenter location'}).click();
 await page.getByRole('button',{name:'Map layers',exact:true}).click();await expect(page.locator('.ex-layer-menu')).toBeVisible();await page.getByLabel('Acquisition timeline',{exact:true}).uncheck();await expect(page.locator('.ex-timeline')).toHaveCount(0);await page.getByLabel('Acquisition timeline',{exact:true}).check();await page.getByRole('button',{name:'Map layers',exact:true}).click();
 await page.getByRole('button',{name:'Map',exact:true}).click();await expect(page.getByRole('button',{name:'Map',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Globe',exact:true}).click();await expect(page.getByRole('button',{name:'Globe',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.x-globe-card')).toHaveAttribute('data-camera-ready','true');
 await expect(page.locator('.x-globe-card')).toHaveAttribute('data-scene-mode','3d');
 await page.getByLabel('NISAR footprints').uncheck();await expect(page.locator('.x-globe-host')).toHaveAttribute('aria-label',/0 catalog acquisition footprints/);await page.getByLabel('NISAR footprints').check();
 // Let Cesium render the restored footprint entities and stream basemap tiles after the mode transition.
 await page.waitForTimeout(1800);
 await page.screenshot({path:'.impeccable/review/explore-design-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Observations',exact:true}).click();const rows=page.locator('.ex-observation-list button');if(await rows.count()){await rows.first().click();await expect(page.locator('.ex-selected')).toBeVisible();await expect(page.getByRole('button',{name:'Inspect observation',exact:true})).toBeEnabled();}
 await page.getByRole('button',{name:'Save location',exact:true}).click();await expect(page.getByRole('button',{name:'Unsave location',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.goto('/my-earth');await expect(page.getByRole('heading',{name:/Saved Locations/})).toContainText('(1)');
});
test('Explore handles failed searches and pointer area drawing with reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/explore');
 await expect(page.locator('.ex-search-status')).toContainText('drawable footprints',{timeout:35000});
 await expect(page.locator('.x-globe-card')).toHaveAttribute('data-camera-ready','true');
 await page.getByRole('button',{name:'Map',exact:true}).click();await expect(page.locator('.x-globe-card')).toHaveAttribute('data-scene-mode','2d');
 await page.getByRole('button',{name:'Draw Area',exact:true}).click();
 await page.getByRole('button',{name:'Select two map corners',exact:true}).click();
 const box=await page.locator('.x-globe-host canvas').boundingBox();
 await page.mouse.click(box.x+box.width*.4,box.y+box.height*.4);await page.mouse.click(box.x+box.width*.6,box.y+box.height*.6);
 await expect(page.getByRole('button',{name:'Select two map corners',exact:true})).toBeVisible();
 await expect(page.getByRole('spinbutton',{name:'West bound'})).not.toHaveValue('');
 await page.route('**/api/asf-search?**',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Catalog temporarily unavailable. Please retry.'})}));
 await page.getByRole('button',{name:'Search observations',exact:true}).click();
 await expect(page.getByRole('alert')).toContainText('Catalog temporarily unavailable');
 await expect(page.locator('.ex-search-status')).toContainText('Search unavailable');
 await expect(page.locator('.ex-summary')).toContainText('No dates returned');
});
test('Explore validates locations and area bounds; mobile stays usable',async({page})=>{
 await page.goto('/explore');await expect(page.locator('.ex-search-status')).toContainText('drawable footprints',{timeout:35000});
 await page.getByLabel('Location or coordinates',{exact:true}).fill('not a place');await page.getByRole('button',{name:'Search observations',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Choose a suggested place');
 await page.getByRole('button',{name:'Draw Area',exact:true}).click();await page.getByRole('button',{name:'Search observations',exact:true}).click();await expect(page.getByRole('alert')).toContainText('bounds');
 for(const [name,value] of [['West','76'],['South','9'],['East','76.5'],['North','9.5']])await page.getByRole('spinbutton',{name:`${name} bound`}).fill(value);
 const response=page.waitForResponse(r=>r.url().includes('/api/asf-search')&&r.url().includes('intersectsWith'));await page.getByRole('button',{name:'Search observations',exact:true}).click();expect((await response).ok()).toBeTruthy();await expect(page.locator('.explore-inspector h2')).toHaveText('Selected area');
 await page.getByRole('button',{name:'Search',exact:true}).click();await page.getByLabel('Location or coordinates',{exact:true}).fill('Vembanad Lake, Kerala');await page.getByRole('button',{name:'Search observations',exact:true}).click();await expect(page.locator('.ex-search-status')).toContainText('drawable footprints',{timeout:35000});await page.setViewportSize({width:390,height:844});await expect(page.getByRole('checkbox',{name:'NISAR footprints',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.screenshot({path:'.impeccable/review/explore-design-mobile.png',fullPage:true});
});
