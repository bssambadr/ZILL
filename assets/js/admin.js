// assets/js/admin.js
import { db, auth } from './firebase-config.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { createElement } from './ui-engine.js';
import { notifications } from './notifications.js';

export async function AdminPage() {
    // Double-check admin email
    if (auth.currentUser?.email !== 'info.bassambadr@gmail.com') {
        return createElement('div', {}, ['غير مصرح']);
    }

    const container = createElement('div', { className: 'admin-panel' }, [
        createElement('h2', {}, ['لوحة التحكم']),
        createElement('button', { className: 'btn', id: 'addStoryBtn' }, ['➕ إضافة قصة جديدة']),
        createElement('div', { id: 'storyList', style: 'margin-top: 24px;' })
    ]);

    // Fetch and display stories
    const storiesSnap = await getDocs(query(collection(db, 'stories'), orderBy('publishedAt', 'desc')));
    const storyList = container.querySelector('#storyList');
    storiesSnap.forEach(docSnap => {
        const story = docSnap.data();
        const card = createElement('div', { className: 'card', style: 'margin-bottom: 12px;' }, [
            createElement('div', { style: 'display: flex; justify-content: space-between;' }, [
                createElement('h4', {}, [story.title]),
                createElement('div', { style: 'display: flex; gap: 8px;' }, [
                    createElement('button', { className: 'btn-outline', style: 'padding: 6px 12px;', onClick: () => editStory(docSnap.id) }, ['تعديل']),
                    createElement('button', { className: 'btn-outline', style: 'padding: 6px 12px; background: #8e0000;', onClick: () => deleteStory(docSnap.id) }, ['حذف']),
                    createElement('button', { className: 'btn-outline', style: 'padding: 6px 12px;', onClick: () => toggleVip(docSnap.id, story.isVip) }, [story.isVip ? 'إلغاء VIP' : 'VIP'])
                ])
            ])
        ]);
        storyList.appendChild(card);
    });

    container.querySelector('#addStoryBtn').onclick = () => showAddStoryModal();
    return container;
}

function showAddStoryModal() {
    notifications.modal({
        title: 'إضافة قصة جديدة',
        content: `
            <input id="storyTitle" placeholder="العنوان" style="width:100%; margin-bottom:12px; padding:12px; background:#2a2a2a; border:1px solid #444; border-radius:12px; color:white;">
            <textarea id="storyContent" placeholder="المحتوى" rows="6" style="width:100%; margin-bottom:12px; padding:12px; background:#2a2a2a; border:1px solid #444; border-radius:12px; color:white;"></textarea>
            <select id="storyCategory" style="width:100%; padding:12px; background:#2a2a2a; border:1px solid #444; border-radius:12px; color:white;">
                <option value="رعب">رعب</option>
                <option value="تشويق">تشويق</option>
                <option value="حقيقية">حقيقية</option>
                <option value="ما وراء الطبيعة">ما وراء الطبيعة</option>
                <option value="ألغاز مظلمة">ألغاز مظلمة</option>
                <option value="تجارب مخيفة">تجارب مخيفة</option>
            </select>
            <label style="display:flex; align-items:center; gap:8px; margin-top:12px;">
                <input type="checkbox" id="storyIsVip"> VIP
            </label>
        `,
        onConfirm: async () => {
            const title = document.getElementById('storyTitle').value;
            const content = document.getElementById('storyContent').value;
            const category = document.getElementById('storyCategory').value;
            const isVip = document.getElementById('storyIsVip').checked;
            if (!title || !content) return notifications.toast('العنوان والمحتوى مطلوبان');
            await addDoc(collection(db, 'stories'), {
                title, content, category, isVip,
                views: 0,
                avgRating: 0,
                publishedAt: new Date(),
                coverUrl: 'assets/img/default-cover.jpg'
            });
            notifications.toast('تمت الإضافة');
            location.reload(); // crude refresh
        }
    });
}

async function deleteStory(id) {
    if (confirm('هل أنت متأكد من حذف القصة؟')) {
        await deleteDoc(doc(db, 'stories', id));
        notifications.toast('تم الحذف');
        location.reload();
    }
}

async function toggleVip(id, current) {
    await updateDoc(doc(db, 'stories', id), { isVip: !current });
    notifications.toast('تم التحديث');
    location.reload();
}

function editStory(id) {
    notifications.toast('وضع التعديل قيد التطوير');
                                                                                                                                                           }
