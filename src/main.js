import '../index.css';

jQuery(function ($) {
  'use strict';

  function createRowsFromProducts(products) {
    $('.cart-row:not(.template)').remove();
    const template$ = $('.cart-row.template');
    products.forEach((product) => {
      const newRow$ = template$.clone().removeClass('template');
      newRow$.find('.data').each(function () {
        const element$ = $(this);
        if (element$.is('.name')) element$.text(product.name);
        if (element$.is('.code')) element$.text(product.code);
        if (element$.is('.price')) element$.text(product.price / 100);
      });
      newRow$.appendTo('.cart-table');
    });
  }

  function createRowsFromDiscounts(discounts) {
    $('.discounts-row:not(.template)').remove();
    const template$ = $('.discounts-row.template');
    discounts.forEach((discount) => {
      const newRow$ = template$.clone().removeClass('template');
      newRow$.find('.computed').each(function () {
        const element$ = $(this);
        if (element$.is('.name')) element$.text(discount.name);
        if (element$.is('.value')) element$.text(discount.value / 100);
      });
      newRow$.appendTo('.discounts-table');
    });
  }

  function getData(context$, key) {
    return context$.find(`.data.${key}`).text();
  }

  function getComputed(context$, key) {
    return context$.find(`.computed.${key}`).text();
  }

  function setComputed(context$, key, value) {
    context$.find(`.computed.${key}`).text(value);
  }

  function sum(array) {
    return array.reduce((acc, val) => acc + val, 0);
  }

  function updateRow(row$, units) {
    setComputed(row$, 'units', units);
    const price = parseFloat(getData(row$, 'price'));
    const total = units * price;
    setComputed(row$, 'total', total);
    updateSummary();
  }

  function updateItems() {
    const units = $('.units', $('.cart-row:not(.template)')).map(function() {
      return parseInt($(this).text(), 10);
    }).get();
    const items = sum(units);
    const summary$ = $('.summary');
    setComputed(summary$, 'items', items);
  }

  function updateItemsTotal() {
    const totals = $('.total', $('.cart-row:not(.template)')).map(function() {
      return parseFloat($(this).text());
    }).get();
    const itemsTotal = sum(totals);
    const summary$ = $('.summary');
    setComputed(summary$, 'itemsTotal', itemsTotal);
  }

  function makeCart() {
    const selected$ = $('.cart-row:not(.template').filter(function() {
      const row$ = $(this);
      const units = parseInt(getComputed(row$, 'units'), 10);
      return units > 0;
    });
    const list = selected$.map(function () {
      const row$ = $(this);
      const units = parseInt(getComputed(row$, 'units'), 10);
      const price = Math.floor(parseFloat(getData(row$, 'price')) * 100);
      const total = Math.floor(parseFloat(getComputed(row$, 'total')) * 100);
      return {
        code: getData(row$, 'code'),
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
      $('.discounts').hide();
    }
    else {
      createRowsFromDiscounts(applicable);
      $('.discounts').show();
    }
  }

  function updateGrandTotal() {
    const summary$ = $('.summary');
    const itemsTotal = getComputed(summary$, 'itemsTotal');
    const discounts = $('.value', $('.discounts-row:not(.template)')).map(function() {
      return parseFloat($(this).text());
    }).get();
    const discountsTotal = sum(discounts);
    setComputed(summary$, 'grandTotal', itemsTotal - discountsTotal);
  }

  function updateSummary() {
    updateItems();
    updateItemsTotal();
    applyDiscounts();
    updateGrandTotal();
  }

  function attachHandlerForDecrementingUnits() {
    const minuses$ = $('.minus');
    minuses$.on('click', function () {
      const button$ = $(this);
      const row$ = button$.parents('.cart-row');
      const units = parseInt(getComputed(row$, 'units'), 10);
      if (units === 0) return;
      updateRow(row$, units - 1);
    });
  }

  function attachHandlerForIncrementingUnits() {
    const pluses$ = $('.plus');
    pluses$.on('click', function () {
      const button$ = $(this);
      const row$ = button$.parents('.cart-row');
      const units = parseInt(getComputed(row$, 'units'), 10);
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
