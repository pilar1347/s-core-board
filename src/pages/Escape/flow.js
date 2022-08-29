const flow = {
  'start': {
    still: 'still-start-min.jpeg',
    text: 'A lovely little house, we must get inside.',
    left: 'leftHouse',
    right: 'rightHouse',
    hotSpots: [
      {
        location: 'bin',
        coords: {
          x: 55,
          y: 48,
          width: 18,
          height: 28
        }
      },
      {
        location: {
          door: {
            true: 'inside',
            false: 'frontDoor'
          }
        },
        coords: {
          x: 39,
          y: 33,
          width: 14,
          height: 25
        }
      },
      {
        location: 'frontRocks',
        coords: {
          x: 70, y: 54, width: 11, height: 18
        }
      }
    ]
  },
  'insideLight': {
    still: 'still-insideLight-min.jpeg',
    text: 'We made it! Yikes, the door just slammed shut behind me. We are trapped!',
    back: 'insideDoor',
    left: 'guitar',
    right: 'shelf',
    hotSpots: [
      {
        location: 'midHallway',
        coords: {
          x: 41,
          y: 8,
          width: 31,
          height: 57
        }
      },
      {
        location: 'livingRoom',
        coords: {
          x: 7,
          y: 11,
          width: 24,
          height: 66
        }
      },
      {
        location: 'endTable',
        coords: {
          x: 29,
          y: 31,
          width: 14,
          height: 30
        }
      }
    ]
  },
  endTable: {
    still: 'still-table-min.jpeg',
    text: 'I love lamp.',
    back: 'insideLight',
    right: 'midHallway',
    left: 'livingRoom',
    hotSpots: [
      {
        location: {
          drawer: {
            true: 'openDrawer',
            false: 'nowhere'
          }
        },
        use: {
          null: {
            text: 'The drawer is stuck!'
          },
          Screwdriver: {
            video: 'video-openDrawer.mp4',
            removeFromInventory: true,
            location: 'openDrawer',
            gameState: 'drawer'
          }
        },
        coords: {
          x: 33,
          y: 51,
          width: 16,
          height: 9
        }
      },
      {
        location: {
          safe: {
            true: 'safeOpen',
            false: 'safe'
          }
        },
        coords: {
          x: 32,
          y: 59,
          width: 19,
          height: 17
        }
      },
      {
        location: 'midHallway',
        coords: {
          x: 55,
          y: 7,
          width: 38,
          height: 82
        }
      }
    ]
  },
  openDrawer: {
    still: 'still-drawerKey-min.jpeg',
    back: 'endTable',
    hotSpots: [
      {
        inventory: {
          name: 'Key',
          image: 'Inventory-patioKey-min.jpeg'
        },
        text: 'A clue, Steve, a clue!',
        coords: {
          x: 36,
          y: 37,
          width: 27,
          height: 31
        }
      }
    ]
  },
  safe: {
    still: 'still-tableSafe-min.jpeg',
    text: 'It\'s a safe! (just pretend, ok?)',
    back: 'endTable',
    hotSpots: [
      {
        use: {
          null: {
            text: 'We need a 4-digit combination.'
          },
          Combo: {
            video: 'video-openSafe.mp4',
            location: 'safeOpen',
            gameState: 'safe',
            removeFromInventory: true
          }
        },
        coords: {
          x: 28,
          y: 39,
          width: 48,
          height: 32
        }
      }
    ]
  },
  safeOpen: {
    still: 'still-safeOpen.jpg',
    back: 'endTable',
    hotSpots: [
      {
        inventory: {
          name: 'Wrench',
          image: 'Inventory-allenWrench-min.jpeg'
        },
        coords: {
          x: 28,
          y: 37,
          width: 45,
          height: 38
        }
      }
    ]
  },
  midHallway: {
    still: 'still-midHallway-min.jpeg',
    text: 'Dang, this B messy',
    back: 'insideLight',
    left: 'office',
    hotSpots: [
      {
        location: 'medals',
        coords: {
          x: 48,
          y: 22,
          width: 20,
          height: 36
        }
      },
      {
        location: 'patioDoor',
        coords: {
          x: 2,
          y: 10,
          width: 38,
          height: 67
        }
      }
    ]
  },
  patioDoor: {
    still: 'still-patioDoor-min.jpeg',
    back: 'midHallway',
    right: 'midHallway',
    left: 'office',
    text: 'A doorway to freedom',
    hotSpots: [
      {
        use: {
          null: {
            text: 'The door is rusted shut, we need some harsh liquid.'
          },
          Key: {
            text: 'The key keeps slipping, there is something greasy on the door.'
          },
          Rag: {
            text: 'There is no liquid to wipe off.'
          },
          Vodka: {
            video: 'video-vodkaPatio.mp4',
            removeFromInventory: true,
            gameState: 'patioVodka',
            location: 'patioDoorRag'
          }
        },
        coords: {
          x: 33,
          y: 42,
          width: 23,
          height: 38
        }
      }
    ]
  },
  patioDoorRag: {
    still: 'still-patioDoor-min.jpeg',
    back: 'midHallway',
    right: 'midHallway',
    left: 'office',
    text: 'A boozy doorway to freedom',
    hotSpots: [
      {
        use: {
          null: {
            text: 'The door is covered in vodka.'
          },
          Key: {
            text: 'The key keeps slipping, there is too much vodka on the door.'
          },
          Rag: {
            video: 'video-wipePatio.mp4',
            text: 'wipey, wipey',
            removeFromInventory: true,
            gameState: 'patioRag',
            location: 'patioDoorKey'
          },
        },
        coords: {
          x: 33,
          y: 42,
          width: 23,
          height: 38
        }
      }
    ]
  },
  patioDoorKey: {
    still: 'still-patioDoor-min.jpeg',
    back: 'midHallway',
    right: 'midHallway',
    left: 'office',
    text: 'A doorway to freedom',
    hotSpots: [
      {
        use: {
          null: {
            text: 'The door is locked! Will this never end??'
          },
          Key: {
            video: 'video-unlockPatio.mp4',
            removeFromInventory: true,
            gameState: 'won',
            location: 'outside'
          }
        },
        coords: {
          x: 33,
          y: 42,
          width: 23,
          height: 38
        }
      }
    ]
  },
  outside: {
    still: 'still-patio-min.jpeg',
    text: 'You are real winners!!'
  },
  office: {
    still: 'still-office.jpg',
    back: 'midHallway',
    right: 'patioDoor',
    hotSpots: [
      {
        location: 'plant',
        coords: {
          x: 1,
          y: 46,
          width: 23,
          height: 41
        }
      },
      {
        location: 'zenTable',
        coords: {
          x: 49,
          y: 50,
          width: 25,
          height: 22
        }
      },
      {
        location: 'pillows',
        coords: {
          x: 69,
          y: 59,
          width: 19,
          height: 30
        }
      }
    ]
  },
  pillows: {
    still: 'still-officePillows-min.jpeg',
    text: 'I just want to lay down and take a nap',
    back: 'office'
  },
  zenTable: {
    still: 'still-officeFountain-min.jpeg',
    back: 'office',
    text: 'So Zen.'
  },
  plant: {
    still: 'still-officePlantScrewdriver-min.jpeg',
    back: 'office',
    hotSpots: [
      {
        inventory: {
          name: 'Screwdriver',
          image: 'Inventory-screwdriver-min.jpeg'
        },
        video: 'video-officePlant.mp4',
        text: 'I found a screwdriver in the plant!',
        coords: {
          x: 39,
          y: 39,
          width: 32,
          height: 24
        }
      }
    ]
  },
  medals: {
    still: 'still-medals-min.jpeg',
    text: 'A real winner lives here.',
    back: 'midHallway',
    hotSpots: [
      {
        inventory: {
          name: 'Combo',
          image: 'Inventory-code-min.jpeg'
        },
        text: 'Hm, this could come in handy',
        coords: {
          x: 34,
          y: 7,
          width: 33,
          height: 33
        }
      }
    ]
  },
  livingRoom: {
    still: 'still-dogs-min.jpeg',
    text: 'Cute dogs',
    back: 'insideLight',
    hotSpots: [
      {
        video: 'video-petAubie.mp4',
        text: 'Aubie - good boy!',
        use: {
          Vodka: {
            text: 'Hey! Don\'t give my dogs vodka you fool!'
          }
        },
        coords: {
          x: 6,
          y: 29,
          width: 32,
          height: 34
        }
      },
      {
        video: 'video-petArtie.mp4',
        text: 'Artie - good boy!',
        use: {
          Vodka: {
            text: 'Hey! Don\'t give my dogs vodka you fool!'
          }
        },
        coords: {
          x: 67,
          y: 41,
          width: 31,
          height: 27
        }
      }
    ]
  },
  insideDoor: {
    still: 'still-frontDoorInside-min.jpeg',
    text: 'The door is glued shut. Forever. We have to find another way out.',
    back: 'insideLight',
    right: 'guitar'
  },
  shelf: {
    still: 'still-shelf-min.jpeg',
    left: 'insideLight',
    back: 'insideLight',
    right: 'insideDoor',
    hotSpots: [
      {
        video: 'video-cactus.mp4',
        text: 'Lol',
        coords: {
          x: 34,
          y: 34,
          width: 19,
          height: 26
        }
      },
      {
        video: 'video-shelfRag.mp4',
        text: 'A really nice rag',
        inventory: {
          name: 'Rag',
          image: 'Inventory-rag-min.jpeg'
        },
        coords: {
          x: 52,
          y: 31,
          width: 18,
          height: 13
        }
      }
    ]
  },
  guitar: {
    still: 'still-guitar-min.jpeg',
    text: 'Wow, whoever made this is awesome beyond belief',
    hotSpots: [
      {
        video: 'video-guitarSkull.mp4',
        text: 'Crystal skull vodka, thanks Dan Akroyd.',
        inventory: {
          name: 'Vodka',
          image: 'Inventory-skull-min.jpeg'
        },
        coords: {
          x: 40,
          y: 39,
          width: 23,
          height: 23
        }
      }
    ],
    right: 'insideLight',
    left: 'insideDoor',
    back: 'insideLight'
  },
  'frontDoor': {
    still: 'still-frontDoor-min.jpeg',
    back: 'start',
    hotSpots: [
      {
        use: {
          null: {
            text: 'It\'s locked. This neighborhood is rough.'
          },
          Rock: {
            text: 'Hey! Do that in your own neighborhood, hooligan.'
          },
          Key: {
            video: 'video-openFrontDoor.mp4',
            location: 'inside',
            gameState: 'door',
            removeFromInventory: true
          }
        },
        coords: {
          x: 36,
          y: 36,
          width: 17,
          height: 20
        }
      },
      {
        location: 'welcomeMat',
        coords: {
          x: 37,
          y: 74,
          width: 31,
          height: 16
        }
      }
    ]
  },
  'inside': {
    basedOn: {
      power: {
        true: 'insideLight',
        false: 'insideDark'
      }
    }
  },
  'insideDark': {
    still: 'still-insideDark-min.jpeg',
    text: 'It\'s too dark, I\'m too scared to go inside.',
    back: 'start'
  },
  'welcomeMat': {
    still: 'still-welcomeMat-min.jpeg',
    back: 'frontDoor',
    text: 'Cute mat, bro.',
    hotSpots: [{
      location: 'welcomeMat-key',
      coords: {
        x: 28,
        y: 38,
        width: 54,
        height: 45
      }
    }]
  },
  'welcomeMat-key': {
    still: 'still-welcomeMatKey-min.jpeg',
    back: 'welcomeMat',
    text: 'Oh wow, a key!',
    hotSpots: [
      {
        inventory: {
          image: 'Inventory-frontKey-min.jpeg',
          name: 'Key'
        },
        coords: {
          x: 30,
          y: 32,
          width: 42,
          height: 42
        }
      }
    ]
  },
  'leftHouse': {
    still: 'still-leftHouse-min.jpeg',
    right: 'start',
    back: 'start',
    hotSpots: [
      {
        location: {
          breaker: {
            true: 'openCircuitBreaker',
            false: 'circuit'
          }
        },
        coords: {
          x: 37,
          y: 4,
          width: 27,
          height: 63
        }
      }
    ]
  },
  'circuit': {
    still: 'still-circuitsClosed-min.jpeg',
    back: 'leftHouse',
    text: 'A circuit breaker box.',
    hotSpots: [
      {
        use: {
          null: {
            text: 'It won\'t open.'
          },
          Rock: {
            video: 'video-smashCircuitBreaker.mp4',
            location: 'openCircuitBreaker',
            removeFromInventory: true,
            gameState: 'breaker'
          },
          Key: {
            text: 'That doesn\'t work here dummy'
          }
        },
        coords: {
          x: 29,
          y: 3,
          width: 34,
          height: 67
        }
      }
    ]
  },
  'openCircuitBreaker': {
    still: 'still-circuitsOpen-min.jpeg',
    back: 'leftHouse',
    right: 'leftHouse',
    text: 'It\'s open! You genius!',
    hotSpots: [
      {
        video: 'video-hitCircuits.mp4',
        gameState: 'power',
        text: 'I just heard the power turn on',
        coords: {
          x: 33,
          y: 21,
          width: 22,
          height: 37
        }
      }
    ]
  },
  'rightHouse': {
    still: 'still-houseRight-min.jpeg',
    left: 'start',
    back: 'start',
    hotSpots: [
      {
        location: 'sock',
        coords: {
          x: 71,
          y: 64,
          width: 12,
          height: 12
        }
      },
      {
        location: 'frontRocks',
        coords: {
          x: 4,
          y: 61,
          width: 14,
          height: 25
        }
      }
    ]
  },
  'frontRocks': {
    still: 'still-frontRocks-min.jpeg',
    back: 'rightHouse',
    hotSpots: [
      {
        location: 'vase',
        coords: {
          x: 56,
          y: 56,
          width: 28,
          height: 28
        }
      },
      {
        video: 'video-getRock.mp4',
        inventory: {
          image: 'Inventory-rock.jpeg',
          name: 'Rock'
        },
        coords: {
          x: 2,
          y: 20,
          width: 26,
          height: 42
        }
      },
    ]
  },
  'vase': {
    still: 'still-vaseLifted-min.jpeg',
    text: 'Nothing under these dead flowers.',
    back: 'frontRocks'
  },
  'rocks': {
    still: 'still-frontRocks-min.jpeg'
  },
  'sock': {
    still: 'still-sock-min.jpeg',
    back: 'rightHouse',
    text: 'Gross, someone lost a sock.'
  },
  'bin': {
    still: 'still-recycleBin-min.jpeg',
    back: 'start',
    text: 'Just a bunch of boxes'
  }
};

export default flow;
