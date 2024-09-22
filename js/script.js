function showAdminForm() {
    document.getElementById('addAdminForm').style.display = 'block';
}
function exitAdminForm() {
    document.getElementById('addAdminForm').style.display = 'none';
}

// // إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBon5IxjZIlqe3P44MTKXu6xTqX5kdKnCA",
    authDomain: "add-owner.firebaseapp.com",
    projectId: "add-owner",
    storageBucket: "add-owner.appspot.com",
    messagingSenderId: "367416374034",
    appId: "1:367416374034:web:e5b5cd9b190083c2adb9cb"
};

// تهيئة التطبيق
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const adminsRef = database.ref('admins');

let adminIdCounter = 11; // يبدأ من 11

// Admin registration function
function registerAdmin(event) {
    event.preventDefault(); // Prevent default form submission
    const adminName = document.getElementById('adminName').value;
    const adminPassword = document.getElementById('adminPassword').value;

    const timestamp = new Date().toISOString();
    const adminId = adminIdCounter++; // زيادة الـ ID بشكل تصاعدي

    adminsRef.child(adminId).set({
        id: adminId,
        name: adminName,
        password: adminPassword,
        createdAt: timestamp
    }).then(() => {
        alert('تم تسجيل الأدمين بنجاح!');
        document.getElementById('addAdminForm').style.display = 'none'; // إخفاء الفورم بعد التسجيل
        displayAdmins(); // تحديث القائمة بعد التسجيل
    }).catch(error => {
        console.error('Error registering admin:', error);
        alert('Error: ' + error.message);
    });
}

// Display admins
function displayAdmins() {
    adminsRef.once('value', (snapshot) => {
        const adminsList = document.getElementById('adminsList');
        adminsList.innerHTML = ""; // مسح القائمة الحالية

        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const li = document.createElement('div');
            li.className = 'admin-item';
            li.innerHTML = `
                <h4>ID: ${data.id}</h4>
                <h4>الاسم: ${data.name}</h4>
                <p>التاريخ: ${data.createdAt}</p>
                <button onclick="deleteAdmin('${childSnapshot.key}')">حذف</button>
                <button onclick="editAdmin('${childSnapshot.key}', '${data.name}', '${data.password}', ${data.id})">تعديل</button>
            `;
            adminsList.appendChild(li);
        });
    });
}

// Delete admin
function deleteAdmin(id) {
    adminsRef.child(id).remove()
        .then(() => {
            alert("تم حذف الأدمين بنجاح!");
            displayAdmins(); // تحديث القائمة
        })
        .catch((error) => {
            console.error("خطأ في حذف الأدمين: ", error);
            alert("حدث خطأ: " + error.message);
        });
}

// Edit admin
function editAdmin(id, name, password, adminId) {
    const newName = prompt("أدخل الاسم الجديد:", name);
    const newPassword = prompt("أدخل كلمة المرور الجديدة:", password);

    if (newName && newPassword) {
        adminsRef.child(id).update({
            id: adminId, // الحفاظ على ID القديم
            name: newName,
            password: newPassword,
            createdAt: new Date().toISOString() // تحديث التاريخ
        })
        .then(() => {
            alert("تم تعديل الأدمين بنجاح!");
            displayAdmins(); // تحديث القائمة
        })
        .catch((error) => {
            console.error("خطأ في تعديل الأدمين: ", error);
            alert("حدث خطأ: " + error.message);
        });
    }
}

// Toggle admins list visibility
function toggleAdmins() {
    const adminsList = document.getElementById('adminsList');
    adminsList.style.display = adminsList.style.display === 'none' ? 'block' : 'none';
}

// Display admins on page load
displayAdmins();