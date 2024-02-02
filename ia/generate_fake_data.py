from random import choice
from faker import Faker

# Initialize the Faker generator
fake = Faker()


def generate_fake_data(num_users: int, num_posts: int, num_likes: int, num_comments: int):
    """Generate fake user data.

    Args:
        num_users: The number of users to generate.
        num_posts: The number of posts per user to generate.
        num_likes: The number of likes per post to generate.
        num_comments: The number of comments per post to generate.

    Returns:
        A tuple containing lists of generated users, posts, likes, and comments.
    """
    users = []
    posts = []
    likes = []
    comments = []

    for _ in range(num_users):
        user_id = fake.unique.uuid4()
        user_name = fake.name()
        user_email = fake.email()
        user_address = fake.unique.address()

        users.append({
            'id': user_id,
            'name': user_name,
            'email': user_email,
            'address': user_address
        })

        # Generate user posts
        for _ in range(num_posts):
            post_id = fake.unique.uuid4()
            post_address = user_address
            post_description = fake.sentence()
            post_image = fake.image_url()
            post_unlisted = fake.pybool()
            post_author_id = user_id

            posts.append({
                'id': post_id,
                'address': post_address,
                'description': post_description,
                'image': post_image,
                'unlisted': post_unlisted,
                'authorId': post_author_id
            })

            # Generate post likes
            for _ in range(num_likes):
                like_id = fake.unique.uuid4()
                like_author_id = choice(users)['id']
                like_post_id = post_id
                like_type = fake.word()

                likes.append({
                    'id': like_id,
                    'authorId': like_author_id,
                    'postId': like_post_id,
                    'type': like_type
                })

            # Generate post comments
            for _ in range(num_comments):
                comment_id = fake.unique.uuid4()
                comment_author_id = choice(users)['id']
                comment_post_id = post_id
                comment_text = fake.sentence()

                comments.append({
                    'id': comment_id,
                    'authorId': comment_author_id,
                    'postId': comment_post_id,
                    'text': comment_text
                })

    return users, posts, likes, comments
