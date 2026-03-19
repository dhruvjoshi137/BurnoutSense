import random

from app.models.schemas import RecommendationBundle


_LIBRARY = {
    "low": {
        "hobbies": [
            "Photography walks",
            "Journaling",
            "Yoga",
            "Sketching",
            "Cycling",
        ],
        "motivational_quotes": [
            "Progress, not perfection.",
            "Small steps every day create big outcomes.",
            "You do not have to do everything today.",
        ],
        "books": [
            "Atomic Habits - James Clear",
            "Deep Work - Cal Newport",
            "Ikigai - Hector Garcia and Francesc Miralles",
        ],
        "anime_or_movies": [
            "My Neighbor Totoro",
            "Kiki's Delivery Service",
            "The Secret Life of Walter Mitty",
        ],
    },
    "moderate": {
        "hobbies": [
            "Guided meditation",
            "Light jogging",
            "Gardening",
            "Music practice",
            "Digital detox hour",
        ],
        "motivational_quotes": [
            "Rest is productive.",
            "You are allowed to pause and breathe.",
            "Your pace is valid.",
        ],
        "books": [
            "The Power of Now - Eckhart Tolle",
            "The Happiness Trap - Russ Harris",
            "Essentialism - Greg McKeown",
        ],
        "anime_or_movies": [
            "Barakamon",
            "A Silent Voice",
            "Little Forest",
        ],
    },
    "high": {
        "hobbies": [
            "Breathing exercises (4-7-8)",
            "Nature walk without phone",
            "Art therapy coloring",
            "Warm shower + sleep routine reset",
            "Short gratitude journaling",
        ],
        "motivational_quotes": [
            "You are more than your productivity.",
            "Healing also counts as progress.",
            "One calm hour can change the whole day.",
        ],
        "books": [
            "Burnout - Emily Nagoski and Amelia Nagoski",
            "Why We Sleep - Matthew Walker",
            "Feeling Good - David D. Burns",
        ],
        "anime_or_movies": [
            "Natsume's Book of Friends",
            "March Comes in Like a Lion",
            "Inside Out",
        ],
    },
}


def build_recommendations(risk_level: str) -> RecommendationBundle:
    bucket = _LIBRARY[risk_level]

    return RecommendationBundle(
        hobbies=random.sample(bucket["hobbies"], k=3),
        motivational_quotes=random.sample(bucket["motivational_quotes"], k=2),
        books=random.sample(bucket["books"], k=2),
        anime_or_movies=random.sample(bucket["anime_or_movies"], k=2),
    )
