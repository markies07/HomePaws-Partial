import React, { useContext, useEffect, useState } from 'react'
import close from './assets/close-dark.svg'
import postComment from './assets/post-comment.svg'
import { AuthContext } from '../../General/AuthProvider';
import { useLikesAndComments } from '../../General/LikesAndCommentsContext';

function Comments({closeComment, postID, handleComment}) {
    const { user } = useContext(AuthContext);
    const { fetchComments } = useLikesAndComments();
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const submitComment = async (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            try{
                await handleComment(postID, user.uid, commentText);
                setCommentText('');
                setComments((prevComments) => [...prevComments, newComment]);
            }
            catch (error) {
                console.error("Error submitting comment: ", error);
                setComments((prevComments) =>
                    prevComments.filter((comment) => comment !== newComment)
                );
            }
            
        }
    };

    useEffect(() => {
        if (!postID) return;
        // Fetch comments when the component is mounted
        const loadComments = async () => {
            const fetchedComments = await fetchComments(postID);
            setComments(fetchedComments);
        };

        loadComments();
    }, [postID]);

    const getTimeDifference = (timestamp) => {
        const now = new Date();
        const timeDiff = Math.abs(now - timestamp.toDate()); // Convert Firestore timestamp to JS Date
      
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(months / 12);
      
        if (seconds < 10) {
          return 'Just now';
        } else if (years > 0) {
          return years === 1 ? '1 year ago' : `${years} years ago`;
        } else if (months > 0) {
          return months === 1 ? '1 month ago' : `${months} months ago`;
        } else if (days > 0) {
          return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (hours > 0) {
          return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else if (minutes > 0) {
          return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else {
          return `${seconds} seconds ago`;
        }
      };

    
    
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-20">
        <div className="relative bg-[#E9E9E9] w-[90%] sm:w-[30rem] h-[65%] rounded-lg py-3 flex flex-col">
            <img onClick={closeComment} className='w-9 p-1 border-2 border-transparent hover:border-text duration-150 absolute top-2 right-2 cursor-pointer' src={close} alt="" />
            <h1 className='text-center shrink-0 text-2xl font-semibold pt-5 mb-4'>Comments</h1>

            <div className='h-full overflow-y-auto px-3 sm:px-5'>


                {/* COMMENT BOX */}
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className='mb-3 flex'>
                            {/* PROFILE PIC */}
                            <img className='w-10 h-10 bg-text rounded-full' src={comment.profilePicture} alt="" />
                            {/* COMMENT */}
                            <div>
                                <div className='bg-secondary px-3 sm:px-4 py-2 ml-2 rounded-xl'>
                                    <p className='font-semibold'>{comment.fullName}</p>
                                    <p className='text-sm'>{comment.commentText}</p>
                                </div>
                                {/* TIME POSTED */}
                                <p className='text-xs ml-4 mt-1'>{getTimeDifference(comment.commentedAt)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='flex justify-center w-full h-full items-center'>
                        <p className='font-medium'>No Comments yet.</p>
                    </div>
                )}
                


            </div>

            {/* POSTING COMMENT */}
            <form onSubmit={submitComment} className='mt-3 flex items-center gap-2 px-3 sm:px-5'>
                <input required value={commentText} onChange={(e) => setCommentText(e.target.value)} className='bg-secondary w-full rounded-full px-4 pt-3 pb-2 outline-none' placeholder='Write a comment.' type="text" />
                <button className='w-11 h-12 shrink-0' type='submit'>
                    <img className='w-12 h-11 p-2 pt-3 cursor-pointer overflow-visible bg-primary rounded-full hover:bg-primaryHover duration-200' src={postComment} alt="" />
                </button>
            </form>
        </div>
    </div>
  )
}

export default Comments


// const handleCommentSubmit = async () => {
//     if (commentText.trim() !== "") {
//       await addComment(postID, commentText, user.uid);
//       setCommentText(""); 
//       const updatedComments = await getCommentsForPost(postID);
//       setComments(updatedComments); 
//     }
//   };
  