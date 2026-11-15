import {test,expect} from '@playwright/test';
test('Home reference composition at desktop and mobile',async({page})=>{
 await page.setViewportSize({width:1214,height:667});await page.goto('/');
 await expect(page.locator('.home-planet canvas')).toBeVisible();
 await expect(page.locator('.hero-earth')).toHaveAttribute('data-earth-ready','true');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Discover what’schanging on Earth.');
 await expect(page.locator('.home-topic')).toHaveCount(6);await expect(page.locator('.home-mission a')).toHaveCount(4);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Pause animations'}).click();
 await page.screenshot({path:'.impeccable/review/home-design-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Explore these coordinates'}).click();await expect(page.getByRole('alert')).toContainText('latitude');
 await page.locator('#discover-location').fill('21.95, 88.77');await page.getByRole('button',{name:'Explore these coordinates'}).click();await expect(page).toHaveURL(/explore\?lat=21.95&lon=88.77/);
 await page.goto('/');await page.setViewportSize({width:390,height:844});await expect(page.locator('.home-planet canvas')).toBeVisible();await expect(page.locator('.hero-earth')).toHaveAttribute('data-earth-ready','true');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.screenshot({path:'.impeccable/review/home-design-mobile.png',fullPage:true});
});
