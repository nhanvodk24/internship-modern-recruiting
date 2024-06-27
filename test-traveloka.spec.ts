import { test, expect } from '@playwright/test';

test('traveloka', async ({ page }) => {
  await page.goto('https://www.traveloka.com/');

  // Nhập nơi khởi hành
  await page.fill('input[placeholder="Origin"]', 'Ho Chi Minh');
  await page.locator('[data-cell-content]').filter({ has: page.getByText('Tansonnhat Intl') }).first().click();

  // Nhập nơi đến
  await page.fill('input[placeholder="Destination"]', 'Japan')
  await page.locator('[data-cell-content]').filter({ has: page.getByText('Jaapa') }).first().click();

  // Tính toán ngày đi và ngày về
  const today = new Date();
  const departDate = new Date(today);
  const returnDate = new Date(today);
  departDate.setDate(today.getDate() + 7);
  returnDate.setDate(today.getDate() + 14);

  // Định dạng ngày theo định dạng 'dd/mm/yyyy'
  const formatDate = (date: Date): string => {
    const day = String(date.getDate());
    const month = String(date.getMonth() + 1); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `date-cell-${day}-${month}-${year}`;
  }

  const formattedDepartDate = formatDate(departDate);
  const formattedReturnDate = formatDate(returnDate);

  // Chọn ngày đi
  await page.locator('[aria-labelledby="depatureDate"]').click();
  // Chọn ngày trong lịch
  await page.locator(`//div[@data-testid='${formattedDepartDate}']`).nth(0).click();

  // Tick chọn ngày về
  await page.locator('div').filter({ hasText: /^Return Date$/ }).nth(2).click();
  // Chọn ngày về
  await page.locator('[aria-labelledby="returnDate"]').click();
  // Chọn ngày trong lịch
  await page.locator(`//div[@data-testid='${formattedReturnDate}']`).nth(1).click();

  await page.getByTestId('desktop-default-search-button').click();

  // Chọn giá thấp nhất
  await page.getByTestId('filter-sort-header').locator('div').filter({ hasText: 'Lowest price' }).nth(1).click();

  // Chọn chuyến bay đi
  await page.getByTestId(`flight-inventory-card-button`).filter({ hasText: 'Choose' }).first().click();
  // Chọn chuyến bay về
  await page.getByTestId(`flight-inventory-card-button`).filter({ hasText: 'Choose' }).first().click();

  // Log information
  await expect(page.getByRole('heading', { name: 'Your Trip' })).toBeVisible();

});