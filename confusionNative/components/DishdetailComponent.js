import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Input, Rating, AirbnbRating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

function RenderComments(props) {
  const comments = props.comments;
  const renderCommentItem = ({item, index}) => {
    return (
        <View key={index} style={{margin: 10}}>
            <Text style={{fontSize: 14}}>{item.comment}</Text>
            <View style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
              <Rating
                imageSize={12}
                readonly
                startingValue={item.rating}
                style={{marginTop: 10, marginBottom: 10}}
              />
            </View>
            <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
        </View>
    );
  };

  return (
    <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
        <Card title='Comments' >
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
        </Card>
      </Animatable.View>
  );
}

function RenderDish(props) {
  const dish = props.dish;
  const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
       if ( dx < -200 )
           return true;
       else
           return false;
   }

   const panResponder = PanResponder.create({
       onStartShouldSetPanResponder: (e, gestureState) => {
           return true;
       },
       onPanResponderEnd: (e, gestureState) => {
           console.log("pan responder end", gestureState);
           if (recognizeDrag(gestureState))
               Alert.alert(
                   'Add Favorite',
                   'Are you sure you wish to add ' + dish.name + ' to favorite?',
                   [
                   {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                   {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                   ],
                   { cancelable: false }
               );

           return true;
       }
   });

   if (dish != null) {
       return(
           <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
           {...panResponder.panHandlers}>
          <Card featuredTitle={dish.name} image={{uri: baseUrl + dish.image}}>
            <Text style={{margin: 10}}>
                {dish.description}
            </Text>
            <View style = {styles.detailActions}>
              <Icon
                raised
                reverse
                name={ props.favorite ? 'heart' : 'heart-o'}
                type='font-awesome'
                color='#f50'
                onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                />
              <Icon
                raised
                reverse
                name={ 'pencil' }
                type='font-awesome'
                color='#512DA8'
                onPress={() => props.toggleModal()}
                />
            </View>
          </Card>
        </Animatable.View>
      );
  }
  else {
      return(<View></View>);
  }
}

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: [],
            showModal: false,
            rating: 0,
            author: "",
            comment: ""
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
       this.props.postFavorite(dishId);
    }

    toggleModal() {
      this.setState({showModal: !this.state.showModal});
    }

    resetForm() {
      this.toggleModal();
      this.setState({
        rating: 0,
        author: "",
        comment: ""
      });
    }

    handleComment(dishId) {
      this.toggleModal();
      this.props.postComment(dishId, this.state.rating, this.state.comment, this.state.author);
      this.resetForm();
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
          <ScrollView>
            <RenderDish dish={this.props.dishes.dishes[+dishId]}
                favorite={this.props.favorites.some(el => el === dishId)}
                onPress={() => this.markFavorite(dishId)}
                toggleModal={() => this.toggleModal()}
                />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            <Modal animationType = {"slide"} transparent = {false}
               visible = {this.state.showModal}
               onDismiss = {() => this.toggleModal() }
               onRequestClose = {() => this.toggleModal() }>
               <View style = {styles.modal}>
                 <Rating
                    count={5}
                    defaultRating={5}
                    showRating
                    onFinishRating={(value) => this.setState({rating: value})}
                    style={{ paddingVertical: 10 }}
                  />
                  <Input
                    onChangeText={(value) => this.setState({author: value})}
                    placeholder=' Author'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                  />
                  <Input
                    onChangeText={(value) => this.setState({comment: value})}
                    placeholder=' Comment'
                    leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                  />

                  <View style={{ marginTop: 20 }}>
                    <Button
                      onPress = {() =>{ this.handleComment(dishId); }}
                      color="#512DA8"
                      title="Submit"
                      />
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <Button style={styles.modalButton}
                      onPress = {() =>{this.resetForm();}}
                      color="#939393"
                      title="Close"
                      />
                  </View>
               </View>
             </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
       justifyContent: 'center',
       margin: 20
    },
    detailActions: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row'
    },
    modalButton: {
      marginTop: 20
    },
    rating: {
      textAlign: 'left'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
