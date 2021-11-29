# README


## Task

Are you up for a challenge? We are looking for the right individuals to help us in our journey towards excellence. We develop and maintain a highly business critical platform that is outdated, tech-wise. We want to help it scale by bringing new technologies and reshaping its architecture and components, with the latest industry trends and practices and the main goal of ensuring stability and scalability. We want to:

- Transition from a legacy architecture to a more modern architecture
- Transition from ZF1 to Symfony
- Replace sphinx search engine by ElasticSearch
- Adapt modern code quality tools
- Work closely with DevOps to improve our infrastructure

![enough](./Screenshot%202021-11-29%20at%2014.52.54.png)


### Description

We need to create a little e-commerce web application. The current prices of the available products are the following:

|Code         | Name         |Price   |
|:------------|:-------------|-------:|
|GOKU         | Goku POP     |   5.00€|
|NARU         | Naruto POP   |  20.00€|
|LUF          |Luffy POP     |   7.50€|


You should:

- Implement the cart logic, load products and add / remove  buttons (left side)
- Add the presentation logic to update "Order summary" subsection whenever a product is added or removed (right site).

Take into account the following aspects:

- Only Vanilla JS (ES5 & ES6) and JQuery is allowed is this exercise from JS perspective.
- Feel free to use tooling (Task runners, unit test, linters or css pre-processors).
- Follow the design as much as you can. Feel free to download the images that you consider.


### BONUS

![discounts](./Screenshot%202021-11-29%20at%2014.51.03.png)

Implement these products discounts that will be applied automatically under some conditions:

- 2-for-1 promotions: buy two of the same product, get one free, applied to GOKU items.
- bulk discounts: buying x or more of a product, the price of that product is reduced, applied to NARU item. P.e. if you buy 3 or more NARU items, the price per unit should be 19.00€.


## Installation

This is how to install everything:

```sh
npm install
```


## Development

This is how to launch a development sever at http://localhost:3000/

```sh
npm run dev
```

## Technologies

- Responsive design / Mobile first with [Tailwindcss](https://tailwindcss.com/) 2.2.19 and [Vite](https://vitejs.dev/) 2.6.14
- Code in ES6+
- Events management and scraping with [jQuery](https://jquery.com/) 3.6.0 slim


## Testing

TODO


## Notes

I enjoyed developing the code of this simple job challenge because it gave me the possibility to try out something for the first time: Tailwind CSS. It was moderately easy to manage even for me, who never wanted to delve into the nitty gritty details of CSS.

Here is the result of my efforts:

### Desktop

![desktop](./Screenshot%202021-11-29%20at%2014.04.35.jpg)


### Mobile

![mobile](./Screenshot%202021-11-29%20at%2015.00.30.png)
