# Recommendation-Systems
User-based and Item-based Implementations

## Introduction

Recommendation systems are used to suggest users a variety of products they may like based off their previous interactions. There are many different types of recommendation systems, however, today we will be focusing on two implementations; user-based and item-based systems. User-based framing emphasizes the similarity between customers (e.g., “People who like this also like…”) while item-based framing instead emphasizes similarities between products. 

In this project, we will be creating scripts to implement and evaluate user-based and item-based recommendation systems.

### The Data Structure

```jsx
5 5 
Alice User1 User2 User3 User4 
Item1 Item2 Item3 Item4 Item5 
5 3 4 4 -1
3 1 2 3 3
4 3 4 3 5
3 3 1 5 4
1 5 5 2 1
```

The data structure we will be using is a matrix of user and item interactions. Interactions are organized into the user-item matrix, where each row represents a user and each column represents an item. 

In the code text-file above, the top row represents the size of the matrix. The next two lines below list the users and items. The matrix below that represents the user rating of each product where -1  represents an unrated item. In the next step, we will be predicting the rating of each unrated item using user-based or item-based recommendation.

### Code for Reading the Data

```jsx
// Read file and process data
fs.readFile("test.txt", "utf-8", (err, data) => {
  if (err) throw err;

  // Parse data
  let lines = data.split("\n");
  line1 = lines[0].split(" ");
  numUsers = parseInt(line1[0]); // # of users
  numItems = parseInt(line1[1]); // # of items

  // Get user data
  let users = lines
    .slice(3)
    .map((user) => user.split(" ").map((x) => parseInt(x)));
});
```

---

## User-Based Recommendations

This recommendation system is designed to personalize recommendations by analyzing the preferences and behaviours of similar users. 

### Calculating Similarities between Users

In user-based recommendation, similarities between users are typically measured using the [Pearson correlation coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient) which calculates the linear correlation between two data sets. Before computing similarities, biases such as average ratings by users are often corrected to reduce the impact of rating scale variations. 

Step 1: Calculate average ratings. This is the mean of all the ratings provided by a user. 

```jsx
// Calculate rating average of our current user Alice
let Ra =
  currentUser
    .filter((x) => x != -1)
    .reduce((prev, curr) => prev + curr) / 
    currentUser.filter((x) => x !== -1).length;
    
// Calculate rating averages of other users
let Rb = otherUsers.map(
  (user) =>
    user.filter((x) => x !== -1).reduce((prev, curr) => prev + curr) /
    user.filter((x) => x !== -1).length
);
```

Step 2: Compute the standard deviation from the averages. For each user-item pair where both users have provided ratings, you calculate the deviation of their ratings from their respective average ratings. This is done to remove the inherent biases of users, i.e., some users might tend to give higher ratings overall, while others might give lower ratings.

```jsx
let std = [];

for (let user = 0; user < numUsers; user++) {
  let ratingDifferenceA = [];
  let ratingDifferenceB = [];
  let sqra = 0;
  let sqrb = 0;

  if (JSON.stringify(currentUser) !== JSON.stringify(otherUsers)) {
    for (let item = 0; item < numItems; item++) {
      if (currentUser[item] !== -1 && otherUsers[user][item] !== -1) {
        ratingDifferences[item] = currentUser[item] - Ra;
        ratingDifferenceB[item] = otherUsers[user][item] - Rb[user]
        sqra += ratingDifferences[item] ** 2;
        sqrb += (otherUsers[user][item] - Rb[user]) ** 2;
      }
    }
  }
  std[i] = Math.sqrt(sqra * sqrb);
}
```

Step 3: Calculate the Bias. The bias for Pearson correlation is computed by taking the product of the deviations of ratings for each item that both users have rated, and summing them up.

```jsx
let std = [];
let bias = [];

for (let user = 0; user < numUsers; user++) {
  let ratingDifferenceA = [];
  let ratingDifferenceB = [];
  let sqra = 0;
	let sqrb = 0;
  bias[user] = 0;

  if (JSON.stringify(currentUser) !== JSON.stringify(otherUsers)) {
    for (let item = 0; item < numItems; item++) {
      if (currentUser[item] !== -1 && otherUsers[user][item] !== -1) {
        ratingDifferenceA[item] = currentUser[item] - Ra;
        ratingDifferenceB[item] = otherUsers[user][item] - Rb[user]
        sqra += ratingDifferences[item] ** 2;
        sqrb += (otherUsers[user][item] - Rb[user]) ** 2;
        bias[user] += ratingDifferenceA[item] * (ratingDifferenceB[item]);
      }
    }
  }
  std[i] = Math.sqrt(sqra * sqrb);
}
```

Step 4: Finally, the [Pearson correlation coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient) can be calculated.

```jsx
let std = [];
let bias = [];
let PCC = []

for (let user = 0; user < numUsers; user++) {
  let ratingDifferenceA = [];
  let ratingDifferenceB = [];
  let sqra = 0;
	let sqrb = 0;
  bias[user] = 0;

  if (JSON.stringify(currentUser) !== JSON.stringify(otherUsers)) {
    for (let item = 0; item < numItems; item++) {
      if (currentUser[item] !== -1 && otherUsers[user][item] !== -1) {
        ratingDifferenceA[item] = currentUser[item] - Ra;
        ratingDifferenceB[item] = otherUsers[user][item] - Rb[user]
        sqra += ratingDifferences[item] ** 2;
        sqrb += (otherUsers[user][item] - Rb[user]) ** 2;
        bias[user] += ratingDifferenceA[item] * (ratingDifferenceB[item]);
      }
    }
  }
  std[user] = Math.sqrt(sqra * sqrb);
  PCC[user] = {user: user, PCC: round(bias[user] / std[user], 2)};
}
```

```jsx
PCC = 
[
  { user: 0, PCC: 1 },
  { user: 1, PCC: 0.84 },
  { user: 2, PCC: 0.61 },
  { user: 3, PCC: 0 },
  { user: 4, PCC: -0.77 }
]
```

### 💡 What does this tell us?

By printing out the value of our PCC values, we can now see the similarities between Alice (user 0) and the other users.

The similarity ratings ranges from -1 to 1. In this test case, user 1 has the most similar taste to Alice and user 4 has the most opposite.

### Predicting the Rating of an Item

Predictions for unrated items are then made by considering the ratings of a k number of similar users, weighted by their similarity scores. This is also called using the k-nearest neighbour.

```jsx
//Predicts rating of an item based on k most similar users
function predictRating(product) {
  let numerator = 0;
  let denominator = 0
  for (let i = 0; i < k; i++) {
    let user = PCC[i].user;
    numerator += PCC[i].PCC * (otherUsers[user][product] - Rb[user]);
    denominator += PCC[i].PCC;
  }
  return round(Ra + numerator / denominator, 2);
}
```

## 🏁 The results!

```jsx
//Test Case Input

5 5 
Alice User1 User2 User3 User4
Item1 Item2 Item3 Item4 Item5
5 3 4 4 -1
3 1 2 3 3
4 3 4 3 5
3 3 1 5 4
1 5 5 2 1

```

```jsx
//results output

┌─────────┬───┬───┬───┬───┬──────┐
│ (index) │ 0 │ 1 │ 2 │ 3 │  4   │
├─────────┼───┼───┼───┼───┼──────┤
│    0    │ 5 │ 3 │ 4 │ 4 │ 4.85 │
│    1    │ 3 │ 1 │ 2 │ 3 │  3   │
│    2    │ 4 │ 3 │ 4 │ 3 │  5   │
│    3    │ 3 │ 3 │ 1 │ 5 │  4   │
│    4    │ 1 │ 5 │ 5 │ 2 │  1   │
└─────────┴───┴───┴───┴───┴──────┘
```

Through user-based recommendation, we have successfully predicted that Alice would really like item5 with a rating of 4.85 ⭐️.

---

## Item-Based Recommendations

Item-based recommendation is a method for suggesting items to users based on similarities between the items themselves. 

## Calculating Similar between Items

This approach calculates the similarity between items using cosine similarity, which measures the angle between rating vectors of items across users. ratings are organized into a user-item matrix, where biases like average ratings are often removed. 

Step 1: calculating average ratings and removing biases.

```jsx
function calcAvg(user) {
  let length = user.filter((x) => x !== -1).length;
  return (
    user.filter((x) => x != -1).reduce((prev, curr) => prev + curr) / length
  );
}

function calcBias(rating, avg) {
  return rating - avg;
}

//calculate averages for each user
let avg = [];
  users.forEach((user) => {
    avg.push(calcAvg(user));
  });

//subtract user bias from users and save into a new matrix
let usersB = [];
  
for (let i = 0; i < numUsers; i++) {
  let newRating = [];
  for (let j = 0; j < numItems; j++) {
    if (users[i][j] !== -1) {
      newRating.push(calcBias(users[i][j], avg[i]));
    } else {
      newRating.push(null);
    }
  }
  usersB.push(newRating);
}
```

step 2: calculating cosine similarities 

```jsx
// Function to calculate cosine similarity between items
function cosSimilarity(user, item, usersB, numItems, numUsers) {
    let CS = [];

    for (let i = 0; i < numItems; i++) {
        let numerator = 0;
        let denominator;
        let a = [];
        let b = [];
        let ratedItems = [];
        for (let j = 0; j < numUsers; j++) {
            if (usersB[j][i] !== null && usersB[j][item] !== null && i !== item) {
                a.push(usersB[j][i]);
                b.push(usersB[j][item]);
                ratedItems.push(j);
            }
        }
        if (i !== item) {
            numerator = dotProduct(a, b); // Calculate dot product
            denominator = eucDistance(a, b); // Calculate Euclidean distance
            CS.push({
                itemID: i,
                similarity: numerator / denominator,
                rui: ratedItems,
            });
        }
    }
    
    CS.sort((a, b) => b.similarity - a.similarity); // Sort similarity scores in descending order
    return CS; // Return the cosine similarity matrix
}
```

### Similarity Scores

```jsx
┌─────────┬────────┬─────────────────────┐
│ (index) │ itemID │     similarity      │
├─────────┼────────┼─────────────────────┤
│    0    │   0    │ 0.8049144823791295  │
│    1    │   3    │ 0.4330626889286792  │
│    2    │   2    │ -0.763560385670225  │
│    3    │   1    │ -0.9082318755225987 │
└─────────┴────────┴─────────────────────┘
```

These are the item similarity scores to item 4. 

we can see that items 0 and items 3 are most similar as they have the highest scores.

Now we can use these scores to predict the rating an item 👇

# Predicting the Rating of an Item

Predictions for unrated items are made by considering the ratings of similar items, weighted by their similarity scores. Now that we have our similarity scores, we can now select a k-number of similar items to determine a prediction. 

```jsx
function prediction(CS, users, user, item,k) {
  let k = 2;
  
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < k; i++) {
    if (users[user][CS[i].itemID] !== -1 && CS[i].similarity > 0) {
      numerator += CS[i].similarity * users[user][CS[i].itemID];
      denominator += CS[i].similarity;
    } else if (CS[i].itemID == user) {
      k++;
    }
  }
  return numerator / denominator;
}
```

## Results

```jsx
//Input
5 5 
Alice User1 User2 User3 User4
Item1 Item2 Item3 Item4 Item5
5 3 4 4 -1
3 1 2 3 3
4 3 4 3 5
3 3 1 5 4
1 5 5 2 1

```

```jsx
//Output
┌─────────┬───┬───┬───┬───┬──────┐
│ (index) │ 0 │ 1 │ 2 │ 3 │  4   │
├─────────┼───┼───┼───┼───┼──────┤
│    0    │ 5 │ 3 │ 4 │ 4 │ 4.65 │
│    1    │ 3 │ 1 │ 2 │ 3 │  3   │
│    2    │ 4 │ 3 │ 4 │ 3 │  5   │
│    3    │ 3 │ 3 │ 1 │ 5 │  4   │
│    4    │ 1 │ 5 │ 5 │ 2 │  1   │
└─────────┴───┴───┴───┴───┴──────┘
```

Through item-based recommendation, we have successfully predicted how likely Alice will enjoy item 5 based on similar items.
