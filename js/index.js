document.addEventListener("DOMContentLoaded", function() {
    // جلب قائمة الكتب
    fetch("http://localhost:3000/books")
        .then(response => response.json())
        .then(books => {
            const list = document.getElementById("list");
            books.forEach(book => {
                const li = document.createElement("li");
                li.textContent = book.title;
                li.addEventListener("click", () => showBookDetails(book)); // عرض تفاصيل الكتاب عند النقر
                list.appendChild(li);
            });
        });
});

function showBookDetails(book) {
    const showPanel = document.getElementById("show-panel");
    showPanel.innerHTML = ""; // تفريغ المحتوى السابق

    // إنشاء عناصر عرض تفاصيل الكتاب
    const thumbnail = document.createElement("img");
    thumbnail.src = book.img_url;

    const title = document.createElement("h2");
    title.textContent = book.title;

    const description = document.createElement("p");
    description.textContent = book.description;

    const usersList = document.createElement("ul");
    book.users.forEach(user => {
        const userLi = document.createElement("li");
        userLi.textContent = user.username;
        usersList.appendChild(userLi);
    });

    // تحقق مما إذا كان المستخدم قد أعجب بالفعل بالكتاب
    const currentUser = { "id": 1, "username": "pouros" };
    const hasLiked = book.users.some(user => user.id === currentUser.id);

    const likeButton = document.createElement("button");
    likeButton.textContent = hasLiked ? "UNLIKE" : "LIKE";
    likeButton.addEventListener("click", () => likeBook(book, likeButton));

    // إضافة العناصر إلى العرض
    showPanel.append(thumbnail, title, description, usersList, likeButton);
}

function likeBook(book, button) {
    const currentUser = { "id": 1, "username": "pouros" };

    const userIndex = book.users.findIndex(user => user.id === currentUser.id);

    if (userIndex >= 0) {
        // إذا كان المستخدم موجودًا بالفعل، قم بإزالته (إلغاء الإعجاب)
        book.users.splice(userIndex, 1);
        button.textContent = "LIKE"; // تحديث النص إلى "LIKE"
    } else {
        // إضافة المستخدم إذا لم يكن موجودًا (إعجاب)
        book.users.push(currentUser);
        button.textContent = "UNLIKE"; // تحديث النص إلى "UNLIKE"
    }

    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ users: book.users })
    })
    .then(response => response.json())
    .then(updatedBook => {
        showBookDetails(updatedBook);
    });
}
