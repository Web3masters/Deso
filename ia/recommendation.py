from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors


def recommend_posts(
    posts: list[dict[str, str]],
    likes: list[dict[str, str]],
    comments: list[dict[str, str]],
    selected_user: dict[str, str]
) -> list[dict[str, str]]:
    """Recommend posts based on the selected user's preferences.

    Args:
        users: A list of users.
        posts: A list of posts.
        likes: A list of likes.
        comments: A list of comments.
        selected_user: The selected user for recommendation.

    Returns:
        A list of recommended posts.
    """

    # Get the posts ids liked by the selected user
    liked_posts_ids = [like['postId']
                       for like in likes if like['authorId'] == selected_user['id']]

    # Get the posts ids commented by the selected user
    commented_posts_ids = [comment['postId']
                           for comment in comments if comment['authorId'] == selected_user['id']]

    # Get the posts ids authored by the selected user
    authored_posts_ids = [
        post['id'] for post in posts if post['authorId'] == selected_user['id']]

    selected_user_posts_ids = list(
        set(authored_posts_ids + liked_posts_ids + commented_posts_ids))

    selected_user_posts = [
        post['description'] for post in posts if post['id'] in selected_user_posts_ids]

    # Create the corpus of post descriptions
    corpus = [post['description'] for post in posts]

    # Apply TF-IDF vectorization on the corpus
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(corpus)

    # Find the K nearest neighbors using KNN
    knn = NearestNeighbors(metric='cosine')
    knn.fit(X)

    # Convert the selected user's post descriptions to TF-IDF vectors
    selected_user_vectors = vectorizer.transform(selected_user_posts)

    # Find the K nearest neighbors for the selected user
    _, indices = knn.kneighbors(selected_user_vectors, n_neighbors=5)

    # Get the recommended posts
    recommended_posts = [posts[index] for index in indices.flatten()]

    return recommended_posts


if __name__ == '__main__':
    from random import choice
    from generate_fake_data import generate_fake_data

    # Generate fake data with 10 users, 20 posts, 5 likes per post, and 3 comments per post
    users, posts, likes, comments = generate_fake_data(10, 20, 5, 3)

    # Select a user for recommendation
    selected_user = choice(users)

    # Recommend posts for the selected user
    recommended_posts = recommend_posts(
        posts, likes, comments, selected_user)

    # Print the recommended posts
    for post in recommended_posts:
        print(post['authorId'], post['description'])
