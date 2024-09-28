import React, { createContext, useContext, useId } from "react";
import { db } from "../../firebase/firebase";
import { doc, writeBatch, increment, serverTimestamp, collection, where, getDocs, query, getDoc } from "firebase/firestore";
import { notifyErrorOrange, notifySuccessOrange } from "./CustomToast";
import defaultPic from '../../assets/icons/default-profile.svg';

const LikesAndCommentsContext = createContext();

export const useLikesAndComments = () => {
    return useContext(LikesAndCommentsContext);
}

export const LikesAndCommentsProvider = ({children}) => {

    // HANDLING LIKE CLICK
    const handleLike = async (postId, likerId, likerName) => {
        try {
            // Fetch the post document to get the post owner's userID
            const postRef = doc(db, 'userPosts', postId);
            const postSnapshot = await getDoc(postRef);
    
            // Check if post exists
            if (!postSnapshot.exists()) {
                console.error('Post not found');
                return;
            }
    
            // Get the postOwnerId from the post data (it's stored as 'userID' in your document)
            const postOwnerId = postSnapshot.data().userID; // Change to userID as per your screenshot
    
            // Check if postOwnerId (userID) is valid
            if (!postOwnerId) {
                console.error('Post owner ID (userID) is missing in the post document!');
                return;
            }
    
            // Initialize a write batch
            const batch = writeBatch(db);
    
            // Storing data to 'likes' collection (this keeps track of likes from specific users)
            const likeRef = doc(collection(db, 'likes'), `${likerId}_${postId}`);
            batch.set(likeRef, {
                postId,
                userId: likerId, // The user who liked the post
                likedAt: serverTimestamp(),
            });
    
            // Storing data to the actual 'userPosts', incrementing the like count
            batch.update(postRef, {
                likeCount: increment(1),
            });
    
            // Check if a notification for this post and action type (like) already exists
            const notificationQuery = query(
                collection(db, 'notifications'),
                where('postId', '==', postId),
                where('type', '==', 'like'),
                where('userId', '==', postOwnerId) // Ensure this matches the post owner (userID)
            );
    
            const existingNotificationSnapshot = await getDocs(notificationQuery);
    
            let newNotificationMessage;
            let otherUserCount = 0;
    
            if (!existingNotificationSnapshot.empty) {
                // If a notification already exists, update it
                const existingNotificationDoc = existingNotificationSnapshot.docs[0];
                const existingNotification = existingNotificationDoc.data();
    
                otherUserCount = existingNotification.otherUserCount || 0;
                otherUserCount += 1;
    
                if (otherUserCount > 1) {
                    // More than 2 likes, update notification to show likerName + others
                    newNotificationMessage = `${likerName} and ${otherUserCount} others liked your post.`;
                } else {
                    // 2 or fewer likes, just show the likerName
                    newNotificationMessage = `${likerName} liked your post.`;
                }
    
                // Update the notification
                batch.update(existingNotificationDoc.ref, {
                    content: newNotificationMessage,
                    otherUserCount,
                    timestamp: serverTimestamp(),
                });
    
            } else {
                // If no notification exists, create a new one
                newNotificationMessage = `${likerName} liked your post.`;
    
                const notificationRef = doc(collection(db, 'notifications'));
                batch.set(notificationRef, {
                    userId: postOwnerId, // Who will receive the notification (post owner)
                    senderId: likerId,   // Who liked the post
                    type: 'like',
                    postId,
                    content: newNotificationMessage,
                    otherUserCount: 0, // Initialize with 0 other users
                    isRead: false,
                    timestamp: serverTimestamp(),
                });
            }
    
            // Commit the batch
            await batch.commit();
    
            console.log('Like successfully added and notification sent/updated!');
        } catch (error) {
            console.error('Error liking the post: ', error);
        }
    };
    

    // HANDLING UNLIKE
    const handleUnlike = async (postId, likerId) => {
        try {
            // Initialize a write batch
            const batch = writeBatch(db);

            // REMOVE LIKE IN 'LIKES' COLLECTION
            const likeRef = doc(db, 'likes', `${likerId}_${postId}`);
            batch.delete(likeRef);

            // DECREMENT LIKE COUNT IN 'USERPOSTS'
            const postRef = doc(db, 'userPosts', postId);
            batch.update(postRef, {
                likeCount: increment(-1),
            });

            // FETCH EXISTING LIKE NOTIFICATIONS
            const notificationQuery = query(
                collection(db, 'notifications'),
                where('postId', '==', postId),
                where('type', '==', 'like')
            );
            
            const notificationSnapshot = await getDocs(notificationQuery);

            if (!notificationSnapshot.empty) {
                const notificationDoc = notificationSnapshot.docs[0];
                const notificationData = notificationDoc.data();
    
                // Fetch the name of the user who liked the post
                const senderDoc = await getDoc(doc(db, 'users', likerId));
                const senderName = senderDoc.exists() ? senderDoc.data().fullName : 'Someone'; // Fallback to 'Someone' if name isn't found
    
                let otherUserCount = notificationData.otherUserCount || 0;
    
                if (otherUserCount > 0) {
                    // IF OTHER USERS LIKED THE POST, UPDATE THE NOTIFICATION
                    otherUserCount -= 1;
                    let updatedMessage;
    
                    if (otherUserCount === 0) {
                        updatedMessage = `${senderName} liked your post.`;
                    } else {
                        updatedMessage = `${senderName} and ${otherUserCount} others liked your post.`;
                    }
    
                    // UPDATE THE EXISTING NOTIFICATION
                    batch.update(notificationDoc.ref, {
                        content: updatedMessage,
                        otherUserCount,
                        timestamp: serverTimestamp(),
                    });
                } else {
                    // IF NO OTHER USERS LIKED THE POST, DELETE THE NOTIFICATION
                    batch.delete(notificationDoc.ref);
                }
            }

            // COMMIT THE BATCH
            await batch.commit();
        } catch (error) {
            console.error('Error unliking the post: ', error);
        }
    };


    // HANDLING COMMENT
    const handleComment = async (postId, userId, commentText) => {
        const batch = writeBatch(db);

        try{
            // ADDING COMMENT TO THE COMMENTS COLLECTION
            const commentRef = doc(collection(db, 'comments'));
            const commentData = {
                postId,
                userId,
                commentText,
                commentedAt: serverTimestamp(),
            };
            batch.set(commentRef, commentData);

            // ADDING COUNT OF COMMENTCOUT IN USERPOSTS
            const postRef = doc(db, 'userPosts', postId);
            batch.update(postRef, {
                commentCount: increment(1),
            });

            // COMMIT THE BATCH
            await batch.commit();

            notifySuccessOrange("Comment posted!");

            // FETCH USER DATA
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data();

            return {
                ...commentData,
                id: commentRef.id,
                fullName: userData.fullName || 'Unknown User',
                profilePicture: userData.profilePictureURL || defaultPic,
            }

        }
        catch(error){
            notifyErrorOrange("Failed posting comment. Please try again");
            throw error;
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
                    id: commentDoc.id,
                    fullName: userData.fullName || 'Unknown User',  // Default if missing
                    profilePicture: userData.profilePictureURL || defaultPic, // Default if missing
                    commentedAt: commentData.commentedAt,
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