import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Row, Col, Label } from 'reactstrap';
    import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';

class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
        isModalOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  submitComment(values) {
    this.toggleModal();
    this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
  }

  render() {
      const required = (val) => val && val.length;
      const maxLength = (len) => (val) => !(val) || (val.length <= len);
      const minLength = (len) => (val) => val && (val.length > len);
      return(
        <div>
          <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
              <LocalForm onSubmit={(values) => this.submitComment(values)}>
                <Row className="form-group">
                  <Label htmlFor="firstname" md={12}>Rating</Label>
                  <Col md={12}>
                    <Control.select model=".rating" id="rating" name="rating"
                        className="form-control">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="3">4</option>
                      <option value="3">5</option>
                    </Control.select>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Label htmlFor="author" md={12}>Your Name</Label>
                  <Col md={12}>
                      <Control.text model=".author" id="author" name="author"
                          placeholder="Your Name"
                          className="form-control"
                          validators={{
                              required, minLength: minLength(2), maxLength: maxLength(15)
                          }}
                           />
                      <Errors
                          className="text-danger"
                          model=".author"
                          show="touched"
                          messages={{
                              required: 'Required',
                              minLength: 'Must be greater than 2 characters',
                              maxLength: 'Must be 15 characters or less'
                          }}
                       />
                  </Col>
                </Row>
                <Row className="form-group">
                    <Label htmlFor="message" md={12}>Comment</Label>
                    <Col md={12}>
                        <Control.textarea model=".comment" id="comment" name="comment"
                            rows="6"
                            className="form-control" />
                    </Col>
                </Row>
                <Row className="form-group">
                  <Col md={12}>
                    <Button type="submit" color="primary">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </LocalForm>
            </ModalBody>
          </Modal>
        </div>
      );
  }
}

function RenderDish({dish}) {
  if (dish != null)
      return(
          <Card>
              <CardImg top src={dish.image} alt={dish.name} />
              <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
              </CardBody>
          </Card>
      );
  else
      return(
          <div></div>
      );
}

function RenderComments({comments, addComment, dishId}) {
  if (comments) {
    const renderedComments = comments.map((comment) => {
      return (
        <ul key={comment.id} className="list-unstyled">
          <li>{comment.comment}</li>
          <li>-- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</li>
        </ul>

      )
    });

    return (
      <div>
          <h4>Comments</h4>
          {renderedComments}
          <CommentForm dishId={dishId} addComment={addComment} />
      </div>

    );
  }

  return (
    <div></div>
  );

}

const  DishDetail = (props) => {

  return(
    <div className="container">
      <div className="row">
          <Breadcrumb>

              <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
              <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
              <h3>{props.dish.name}</h3>
              <hr />
          </div>
      </div>
      <div className="row">
          <div className="col-12 col-md-5 m-1">
              <RenderDish dish={props.dish} />
          </div>
          <div className="col-12 col-md-5 m-1">
          <RenderComments comments={props.comments}
              addComment={props.addComment}
              dishId={props.dish.id}
            />
          </div>
      </div>
    </div>
  );

}
export default DishDetail;
