import '../index.css';

jQuery(function ($) {
  'use strict';

  function createRowsFromProducts(products) {
    $('.CART-ROW:not(.TEMPLATE)').remove();
    const template$ = $('.CART-ROW.TEMPLATE');
    products.forEach((product) => {
      const newRow$ = template$.clone().removeClass('TEMPLATE');
      newRow$.find('.DATA').each(function () {
        const element$ = $(this);
        if (element$.is('.NAME')) element$.text(product.name);
        if (element$.is('.CODE')) element$.text(product.code);
        if (element$.is('.PRICE')) element$.text(product.price / 100);
      });
      newRow$.appendTo('.CART-TABLE');
    });
  }

  function createRowsFromDiscounts(discounts) {
    $('.DISCOUNTS-ROW:not(.TEMPLATE)').remove();
    const template$ = $('.DISCOUNTS-ROW.TEMPLATE');
    discounts.forEach((discount) => {
      const newRow$ = template$.clone().removeClass('TEMPLATE');
      newRow$.find('.COMPUTED').each(function () {
        const element$ = $(this);
        if (element$.is('.NAME')) element$.text(discount.name);
        if (element$.is('.VALUE')) element$.text(discount.value / 100);
      });
      newRow$.appendTo('.DISCOUNTS-TABLE');
    });
  }

  function getData(context$, key) {
    return context$.find(`.DATA.${key}`).text();
  }

  function getComputed(context$, key) {
    return context$.find(`.COMPUTED.${key}`).text();
  }

  function setComputed(context$, key, value) {
    context$.find(`.COMPUTED.${key}`).text(value);
  }

  function sum(array) {
    return array.reduce((acc, val) => acc + val, 0);
  }

  function updateRow(row$, units) {
    setComputed(row$, 'UNITS', units);
    const price = parseFloat(getData(row$, 'PRICE'));
    const total = units * price;
    setComputed(row$, 'TOTAL', total);
    updateSummary();
  }

  function updateItems() {
    const units = $('.UNITS', $('.CART-ROW:not(.TEMPLATE)')).map(function() {
      return parseInt($(this).text(), 10);
    }).get();
    const items = sum(units);
    const summary$ = $('.SUMMARY');
    setComputed(summary$, 'ITEMS', items);
  }

  function updateItemsTotal() {
    const totals = $('.TOTAL', $('.CART-ROW:not(.TEMPLATE)')).map(function() {
      return parseFloat($(this).text());
    }).get();
    const itemsTotal = sum(totals);
    const summary$ = $('.SUMMARY');
    setComputed(summary$, 'ITEMS-TOTAL', itemsTotal);
  }

  function makeCart() {
    const selected$ = $('.CART-ROW:not(.TEMPLATE').filter(function() {
      const row$ = $(this);
      const units = parseInt(getComputed(row$, 'UNITS'), 10);
      return units > 0;
    });
    const list = selected$.map(function () {
      const row$ = $(this);
      const units = parseInt(getComputed(row$, 'UNITS'), 10);
      const price = Math.floor(parseFloat(getData(row$, 'PRICE')) * 100);
      const total = Math.floor(parseFloat(getComputed(row$, 'TOTAL')) * 100);
      return {
        code: getData(row$, 'CODE'),
        units,
        price,
        total,
      }
    }).get();
    const result = list.reduce((acc, val) => {
      acc[val.code] = val;
      return acc;
    }, {});
    return result;
  }

  function applyDiscounts() {
    const cart = makeCart();

    const applicable = discounts.map((discount => {
      const value = discount.value(cart);
      if (value === 0) return null;
      return {
        ...discount,
        value,
      };
    })).filter(x => !!x);

    if (applicable.length === 0) {
      $('.DISCOUNTS').hide();
    }
    else {
      createRowsFromDiscounts(applicable);
      $('.DISCOUNTS').show();
    }
  }

  function updateGrandTotal() {
    const summary$ = $('.SUMMARY');
    const itemsTotal = getComputed(summary$, 'ITEMS-TOTAL');
    const discounts = $('.VALUE', $('.DISCOUNTS-ROW:not(.TEMPLATE)')).map(function() {
      return parseFloat($(this).text());
    }).get();
    const discountsTotal = sum(discounts);
    setComputed(summary$, 'GRAND-TOTAL', itemsTotal - discountsTotal);
  }

  function updateSummary() {
    updateItems();
    updateItemsTotal();
    applyDiscounts();
    updateGrandTotal();
  }

  function attachHandlerForDecrementingUnits() {
    const minuses$ = $('.MINUS');
    minuses$.on('click', function () {
      const button$ = $(this);
      const row$ = button$.parents('.CART-ROW');
      const units = parseInt(getComputed(row$, 'UNITS'), 10);
      if (units === 0) return;
      updateRow(row$, units - 1);
    });
  }

  function attachHandlerForIncrementingUnits() {
    const pluses$ = $('.PLUS');
    pluses$.on('click', function () {
      const button$ = $(this);
      const row$ = button$.parents('.CART-ROW');
      const units = parseInt(getComputed(row$, 'UNITS'), 10);
      updateRow(row$, units + 1);
    });
  }

  console.log(`Using jQuery ${$.fn.jquery}`);

  const products = [
    {
      code: 'GOKU',
      name: 'Goku POP',
      price: 500,
    },
    {
      code: 'NARU',
      name: 'Naruto POP',
      price: 2000,
    },
    {
      code: 'LUF',
      name: 'Luffy POP',
      price: 750,
    },
  ];

  const discounts = [
    {
      name: '2x1 Goku POP offer',
      value: (cart) => cart['GOKU'] ? Math.floor(cart['GOKU'].units / 2) * cart['GOKU'].price : 0,
    },
    {
      name: 'x3 Naruto POP offer',
      value: (cart) => cart['NARU'] ? cart['NARU'].units >= 3 ? cart['NARU'].units * 100 : 0 : 0,
    }
  ];

  createRowsFromProducts(products);
  attachHandlerForDecrementingUnits();
  attachHandlerForIncrementingUnits();
});
