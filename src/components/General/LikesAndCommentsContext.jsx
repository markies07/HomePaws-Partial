import React, { createContext, useContext, useId } from "react";
import { db } from "../../firebase/firebase";
import { doc, writeBatch, increment, serverTimestamp, collection, addDoc, where, getDocs, query, getDoc } from "firebase/firestore";
import { notifyErrorOrange, notifySuccessOrange } from "./CustomToast";

const LikesAndCommentsContext = createContext();

export const useLikesAndComments = () => {
    return useContext(LikesAndCommentsContext);
}

export const LikesAndCommentsProvider = ({children}) => {

    // HANDLING LIKE CLICK
    const handleLike = async (postId, userId) => {
        const batch = writeBatch(db);

        // STORING DATA TO LIKE COLLECTION
        const likeRef = doc(collection(db, 'likes'), `${userId}_${postId}`);
        batch.set(likeRef, {
            postId,
            userId,
            likedAt: serverTimestamp(),
        });

        // STORING DATA TO THE ACTUAL USERPOSTS
        const postRef = doc(db, 'userPosts', postId);
        batch.update(postRef, {
            likeCount: increment(1),
        });

        // COMMIT THE BATCH
        await batch.commit();
    }

    // HANDLING UNLIKE
    const handleUnlike = async (postId, userId) => {
        const batch = writeBatch(db);

        // REMOVING LIKE IN LIKE COLLECTION
        const likeRef = doc(db, 'likes', `${userId}_${postId}`);
        batch.delete(likeRef);

        // DECREMENT LIKECOUNT IN USERPOSTS
        const postRef = doc(db, 'userPosts', postId);
        batch.update(postRef, {
            likeCount: increment(-1),
        });

        // COMMIT THE BATCH
        await batch.commit();
    }

    // HANDLING COMMENT
    const handleComment = async (postId, userId, commentText) => {
        const batch = writeBatch(db);

        try{
            // ADDING COMMENT TO THE COMMENTS COLLECTION
            const commentRef = doc(collection(db, 'comments'));
            batch.set(commentRef, {
                postId,
                userId,
                commentText,
                commentedAt: serverTimestamp(),
            });

            // ADDING COUNT OF COMMENTCOUT IN USERPOSTS
            const postRef = doc(db, 'userPosts', postId);
            batch.update(postRef, {
                commentCount: increment(1),
            });
            notifySuccessOrange("Comment posted!");

            // COMMIT THE BATCH
            await batch.commit();
        }
        catch(error){
            notifyErrorOrange("Failed posting comment. Please try again");
        }
    }

    const fetchComments = async (postId) => {
        const q = query(collection(db, 'comments'), where('postId', '==', postId));
        const commentsSnapshot = await getDocs(q);
        const commentsWithUserProfile = [];

        for (const commentDoc of commentsSnapshot.docs) {
            const commentData = commentDoc.data();
            const userId = commentData.userId;

            // Fetch the user's profile from 'users' collection
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                commentsWithUserProfile.push({
                    ...commentData,
                    fullName: userData.fullName || 'Unknown User',  // Default if missing
                    profilePicture: userData.profilePictureURL || '/default-profile.png', // Default if missing
                });
            } else {
                console.log('User profile not found!');
            }
        }

    return commentsWithUserProfile;
    };


    const value = {
        handleLike,
        handleUnlike,
        handleComment,
        fetchComments
    }

    return (
        <LikesAndCommentsContext.Provider value={value}>
            {children}
        </LikesAndCommentsContext.Provider>
    );

}