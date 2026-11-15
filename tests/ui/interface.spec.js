import {test,expect} from '@playwright/test';
test('Mobile navigation manages keyboard focus and Escape',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 const opener=page.getByRole('button',{name:'Open navigation',exact:true});await opener.click();
 await expect(page.getByRole('dialog',{name:'Site navigation'})).toBeVisible();await expect(page.getByRole('button',{name:'Close navigation',exact:true})).toBeFocused();
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(opener).toBeFocused();
});
test('Topic intent reaches the applied product and controls remain legible',async({page})=>{
 await page.route('**/api/asf-search?**',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({records:[],fetchedAt:'2026-11-15T00:00:00Z',query:{},limit:80})}));
 await page.goto('/topics/farms');await page.getByRole('button',{name:'Open Explore Map',exact:true}).click();
 await expect(page.locator('.ex-lenses button.active')).toHaveText('Farms & Soil');await expect(page.locator('.ex-search-status')).toContainText('0 observations');
 await page.getByText('Product and data source',{exact:true}).click();await expect(page.locator('.ex-products input:checked')).toHaveCount(1);await expect(page.locator('.ex-products input:checked').locator('..')).toContainText('SME2');
 await page.getByRole('button',{name:'Ground Movement',exact:true}).click();await expect(page.locator('.ex-filter-notice')).toContainText('Search to apply');
 await page.getByRole('button',{name:'Search observations',exact:true}).click();await expect(page.locator('.ex-filter-notice')).toHaveCount(0);
});
test('Home rejects extra coordinate fields and retains its search action',async({page})=>{
 await page.goto('/');await page.locator('#discover-location').fill('21.95,88.77,invalid');await page.getByRole('button',{name:'Explore these coordinates'}).click();
 await expect(page.getByRole('alert')).toContainText('latitude');await expect(page).toHaveURL(/\/$/);await expect(page.locator('.home-location button')).toContainText('Explore');
});
