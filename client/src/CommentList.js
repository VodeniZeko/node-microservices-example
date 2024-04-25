import React from "react";

const CommentList = ({ comments }) => {
	const renderedComments = comments.map(({ id, content, status }) => {
		let newContent;

		switch (status) {
			case "pending":
				newContent = "This comment is pending";
				break;
			case "rejected":
				newContent = "This comment has been rejected";
				break;
			case "approved":
				newContent = content;
				break;
			default:
				break;
		}

		return <li key={id}>{newContent}</li>;
	});

	return <ul>{renderedComments}</ul>;
};

export default CommentList;
