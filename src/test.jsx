const deleteConversation = async () => {
    confirm(Deleting Conversation, Are you sure you want to delete this conversation?).then(async (result) => {
        if(result.isConfirmed){
            try{
                const messagesRef = collection(db, 'chats', chatID, messages_${user.uid});

                const messagesSnapshot = await getDocs(messagesRef);
        
                messagesSnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                });
        
                const otherUserMessages = collection(db, 'chats', chatID, messages_${otherUser.uid});
                const otherUserMessagesSnapshot = await getDocs(otherUserMessages);
        
                if (otherUserMessagesSnapshot.empty){
                    await deleteDoc(doc(db, 'chats', chatID));
                }
                navigate('/dashboard/chat')
            }
            catch(error){
                notifyErrorOrange('There was an issue deleting this conversation. Please try again');
                console.error('Error deleting conversation: ', error);
            }
        }
    })
}