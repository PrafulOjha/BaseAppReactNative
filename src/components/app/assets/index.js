import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, FlatList, View, AsyncStorage, AppState, TouchableOpacity, Alert, Image, TouchableHighlight } from 'react-native';
import { Container, Content, StyleProvider } from 'native-base';
import { ValidationComponent, Toast } from '../../../helper';
import { HeaderComponent, Loader, Text } from '../../common';
import getTheme from '../../../../native-base-theme/components';
import material from '../../../../native-base-theme/variables/platform';
import ImagePicker from 'react-native-image-picker';
import MediaMeta from 'react-native-media-meta';
import ImageSlider from 'react-native-image-slider';
import Video from 'react-native-video';
import SideSwipe from 'react-native-sideswipe';
import { Dimensions } from 'react-native';

class AssetLists extends ValidationComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            deviceId: '',
            devicesStatus: [],
            helper: {
                loading: false
            },
            currentIndex: 0,
            interval: null,
            isPause: true,
            images: [
                {
                    type: 'video',
                    filePath: require('../../../assets/video/broadchurch.mp4'),
                    time: 15000
                },
                {
                    type: 'png',
                    filePath: 'https://placeimg.com/640/640/nature.png',
                    time: 6000
                },
                {
                    type: 'png',
                    filePath: 'https://placeimg.com/640/640/animals.png',
                    time: 6000
                },
                {
                    type: 'video',
                    filePath: require('../../../assets/video/y2mate.mp4'),
                    time: 11000
                }
            ]
        };
    }

    openVideoPicker() {
        const options = {
            title: 'Select Video',
            takePhotoButtonTitle: 'Record from Camera',
            chooseFromLibraryButtonTitle: 'Select from Gallery',
            mediaType: 'video',
            durationLimit: 8,
            storageOptions: {
                skipBackup: true
            },
            allowsEditing: true
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                console.log('response: ', response);
                MediaMeta.get(response.path)
                    .then(metadata => {
                        console.log(metadata)
                        if (metadata.duration > 8) {
                            Alert.alert(
                                'Sorry',
                                'Video duration must be less then 30 Seconds',
                                [
                                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                                ],
                                { cancelable: false }
                            );
                        } else {
                            // Upload or do something else
                            console.log('upload')
                        }
                    })
                    .catch(err => console.error(err));
            }
        });
    }

    componentDidMount() {
        /** Default check video */
        setTimeout(() => {
            this.videoPlay();
        }, 500);
        // this.state.images.map((val) => {
        //     console.log('val ', val.time)
        //     this.interval = setInterval(() => {
        //         if (this.state.currentIndex < (this.state.images.length - 1)) {
        //             this.setState(prevState => ({
        //                 currentIndex: prevState.currentIndex + 1
        //             }), () => {
        //                 this.videoPlay();
        //             })
        //         } else {
        //             clearInterval(this.interval);
        //         }
        //     }, val.time);
        // })
        this.interval = setInterval(() => {
            if (this.state.currentIndex < (this.state.images.length - 1)) {
                this.setState(prevState => ({
                    currentIndex: prevState.currentIndex + 1
                }), () => {
                    this.videoPlay();
                })
            } else {
                clearInterval(this.interval);
            }
        }, this.state.images[this.state.currentIndex].time);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    videoPlay = () => {
        const state = this.state;
        const currentMedia = state.images[state.currentIndex];
        console.log("videoPlay", currentMedia);
        if (currentMedia.type == 'video') {
            this.setState({
                isPause: false
            });
        } else {
            this.setState({
                isPause: true
            });
        }
    }

    /**
    * @method render
    * @description to render component
    */
    render() {
        const { width } = Dimensions.get('window') + 100;
        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={innerStyle.container}>
                    <Loader isLoading={this.state.helper.loading} />
                    <HeaderComponent
                        title='National Park'
                        leftButton='menu'
                        routeName='Home'
                        info={true}
                        rightAction={() => this.props.navigation.navigate('Sites')}
                    />
                    <Content>
                        <View style={paddingTop.Ten}>
                            <Text>Dashboard</Text>
                            <TouchableOpacity onPress={this.openVideoPicker}>
                                <Text style={innerStyle.uploadTitle}>{'UPLOAD'}</Text>
                            </TouchableOpacity>
                            {/* <ImageSlider
                                loopBothSides
                                //autoPlayWithInterval={5000}
                                images={this.state.images}
                                onPositionChanged={(index) => {
                                    this.setState(() => ({ currentIndex: index }),
                                        () => {
                                            this.videoPlay();
                                        })
                                }}
                                customSlide={({ index, item, style, width }) => {
                                    return (
                                        // It's important to put style here because it's got offset inside
                                        // this.renderSlides(index, item, style, width)

                                        <View key={index} style={[style, innerStyle.customSlide]}>
                                            {(item.type == 'video') &&
                                                <Video
                                                    repeat={true}
                                                    source={item.filePath}   // Can be a URL or a local file.
                                                    autoplay={false}
                                                    ref={(ref) => {
                                                        this.player = ref
                                                    }}
                                                    paused={this.state.isPause}                                    // Store reference
                                                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                                    onError={this.videoError}
                                                    startWithThumbnail={true}
                                                    endWithThumbnail={true}               // Callback when video cannot be loaded
                                                    style={innerStyle.customImage} />
                                            }
                                            {(item.type == 'png') &&
                                                <Image source={{ uri: item.filePath }} style={innerStyle.customImage} />
                                            }
                                        </View>
                                    )
                                }
                                }
                            /> */}
                            <Text style={{ textColor: 'red' }}>Pause : {this.state.isPause ? 'TRUE' : 'FALSE'}</Text>
                            <SideSwipe
                                index={this.state.currentIndex}
                                itemWidth={width}
                                style={{ width }}
                                data={this.state.images}
                                //contentOffset={contentOffset}
                                onIndexChange={index =>
                                    this.setState(() => ({ currentIndex: index }),
                                        () => {
                                            this.videoPlay();
                                        })
                                }
                                renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
                                    <View key={itemIndex} >
                                        {(item.type == 'video') &&
                                            <Video
                                                repeat={true}
                                                source={item.filePath}   // Can be a URL or a local file.
                                                autoplay={false}
                                                ref={(ref) => {
                                                    this.player = ref
                                                }}
                                                paused={this.state.isPause}                                      // Store reference
                                                onBuffer={this.onBuffer}                // Callback when remote video is buffering
                                                onError={this.videoError}
                                                startWithThumbnail={true}
                                                endWithThumbnail={true}               // Callback when video cannot be loaded
                                                style={innerStyle.customImage} />
                                        }
                                        {(item.type == 'png') &&
                                            <Image source={{ uri: item.filePath }} style={innerStyle.customImage} />
                                        }
                                    </View>
                                )}
                            />
                        </View>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}
const mapStateToProps = () => {
    return {};
};

export default connect(mapStateToProps, null)(AssetLists);

const innerStyle = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    customImage: {
        width: 400,
        height: 400,
    },
    customVideo: {
        width: 600,
        height: 600,
    },
    customSlide: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
